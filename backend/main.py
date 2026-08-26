import re
import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import requests
from dotenv import load_dotenv

load_dotenv()

SF_LOGIN_URL = os.getenv("SF_LOGIN_URL", "https://test.salesforce.com/services/oauth2/token")
SF_CLIENT_ID = os.getenv("SF_CLIENT_ID", "")
SF_CLIENT_SECRET = os.getenv("SF_CLIENT_SECRET", "")
SF_USERNAME = os.getenv("SF_USERNAME", "")
SF_PASSWORD = os.getenv("SF_PASSWORD", "")
SF_API_URL = os.getenv("SF_API_URL", "https://embassygroup--uatrelease.sandbox.my.salesforce.com/services/apexrest/EmbosReferral")

def get_salesforce_token():
    if not SF_CLIENT_ID or not SF_CLIENT_SECRET:
        return None
    
    # Client credentials flow with query parameters
    params = {
        "grant_type": "client_credentials",
        "client_id": SF_CLIENT_ID,
        "client_secret": SF_CLIENT_SECRET
    }
    
    response = requests.post(SF_LOGIN_URL, params=params)
    if response.status_code != 200:
        raise HTTPException(
            status_code=response.status_code,
            detail=f"Salesforce OAuth login failed: {response.text}"
        )
    return response.json().get("access_token")


app = FastAPI(title="Referral Tracking Portal API")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the exact frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Referral(BaseModel):
    id: str
    referralName: str
    project: str
    leadStatus: str
    opportunityStatus: str
    createdDate: Optional[str] = None



EMAIL_REGEX = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"

@app.get("/api/referrals", response_model=List[Referral])
def get_referrals(
    email: str = Query(..., description="The user email to look up referrals for"),
    search: Optional[str] = Query(None, description="Search query by name"),
    project: Optional[str] = Query(None, description="Filter by project name"),
    leadStatus: Optional[str] = Query(None, description="Filter by lead status"),
    opportunityStatus: Optional[str] = Query(None, description="Filter by opportunity status")
):
    # Validate email format
    if not re.match(EMAIL_REGEX, email):
        raise HTTPException(status_code=400, detail="Invalid email format")

    referrals = []
    is_credentials_configured = bool(SF_CLIENT_ID and SF_CLIENT_SECRET)

    if is_credentials_configured:
        try:
            token = get_salesforce_token()
        except HTTPException as he:
            raise he
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to retrieve Salesforce token: {str(e)}")

        try:
            url = f"https://embassygroup--uatrelease.sandbox.my.salesforce.com/services/apexrest/EmbosReferral?empEmail={email}"
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
            sf_res = requests.get(url, headers=headers)
            if sf_res.status_code != 200:
                raise HTTPException(
                    status_code=sf_res.status_code,
                    detail=f"Salesforce Retrieve API Error: {sf_res.text}"
                )
            sf_data = sf_res.json()
            sf_referrals = sf_data.get("referrals", [])
            for ref in sf_referrals:
                opp = ref.get("opportunity")
                opp_status = opp.get("stageName") if opp else "-"
                referrals.append({
                    "id": ref.get("leadId", ""),
                    "referralName": ref.get("leadName", ""),
                    "project": ref.get("projectInterested", ""),
                    "leadStatus": ref.get("leadStatus", "Open"),
                    "opportunityStatus": opp_status,
                    "createdDate": ref.get("createdDate")
                })
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to retrieve referrals from Salesforce: {str(e)}")
    else:
        if email.startswith("error"):
            raise HTTPException(status_code=500, detail="Internal Server Error: Unable to fetch referrals.")
        referrals = []

    # Apply filters
    filtered_referrals = referrals.copy()

    if search:
        search_lower = search.lower()
        filtered_referrals = [
            r for r in filtered_referrals
            if search_lower in r["referralName"].lower()
        ]

    if project and project != "All Projects":
        filtered_referrals = [
            r for r in filtered_referrals
            if r["project"] == project
        ]

    if leadStatus and leadStatus != "All Lead Statuses":
        filtered_referrals = [
            r for r in filtered_referrals
            if r["leadStatus"] == leadStatus
        ]

    if opportunityStatus and opportunityStatus != "All Opportunity Stages":
        filtered_referrals = [
            r for r in filtered_referrals
            if r["opportunityStatus"] == opportunityStatus
        ]

    return filtered_referrals

PROJECTS = [
    "Embassy Edge Apartments",
    "Embassy One",
    "Embassy Lake Terraces",
    "Embassy Boulevard",
    "Embassy Grove",
    "Embassy Springs",
    "Embassy Springs - Town Centre Plots",
    "Embassy Springs - Estate Plots",
    "Embassy East Avenue",
    "By The Lake Plots",
    "Embassy Verde",
    "Embassy One Thane",
    "Embassy Paradiso",
    "Golf City Savroli",
    "Embassy Park Panvel",
    "Embassy Greenshore",
    "Embassy Citadel",
    "Embassy Verde 2",
    "Embassy Juhu",
    "Embassy Serenity",
    "Embassy Eden",
    "Embassy Origins",
    "Embassy Terazza"
]

@app.get("/api/projects", response_model=List[str])
def get_projects(email: str):
    if email.startswith("empty") or email.startswith("error"):
        return []
    return sorted(PROJECTS)

class LeadCreate(BaseModel):
    empId: str
    empName: str
    empMobile: str
    empEmail: str
    salutation: str
    name: str
    countryCode: str
    mobile: str
    email: str
    projectInterested: str
    SubSource: str

@app.post("/api/leads", response_model=Referral)
def create_lead(lead: LeadCreate):
    # Try Salesforce integration first if credentials are set
    token = None
    try:
        token = get_salesforce_token()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if token:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        payload = lead.model_dump()
        if "SubSource" in payload:
            payload["subSource"] = payload.pop("SubSource")
        try:
            sf_res = requests.post(SF_API_URL, json=payload, headers=headers)
            if sf_res.status_code not in (200, 201):
                raise HTTPException(
                    status_code=sf_res.status_code, 
                    detail=f"Salesforce API Error: {sf_res.text}"
                )
            
            sf_data = sf_res.json()
            if sf_data.get("status") == "Error":
                raise HTTPException(
                    status_code=400, 
                    detail=sf_data.get("message", "Lead already exists")
                )
            
            lead_id = sf_data.get("leadId") or "TBD"
            new_referral = {
                "id": str(lead_id),
                "referralName": lead.name,
                "project": lead.projectInterested,
                "leadStatus": "Open",
                "opportunityStatus": "Pre-Sales"
            }
            return new_referral

        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to connect to Salesforce: {str(e)}")
            
    else:
        raise HTTPException(
            status_code=503,
            detail="Salesforce integration is not configured. Please set SF_CLIENT_ID and SF_CLIENT_SECRET."
        )


