import requests

ERP_BASE_URL = "http://localhost:8080"

class ERPError(Exception):
    pass


def _headers(token: str):
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }


import requests

ERP_BASE_URL = "http://localhost:8080"


class ERPError(Exception):
    pass


def _headers(token: str):
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }


def safe_get(url: str, token: str):
    try:
        res = requests.get(
            url,
            headers=_headers(token),
            timeout=5
        )
        res.raise_for_status()
        return res.json()
    except Exception as e:
        return {"error": str(e)}




def get_low_stock(token: str):
    return safe_get(f"{ERP_BASE_URL}/inventory/low-stock", token)


def get_invoices(token: str):
    return safe_get(f"{ERP_BASE_URL}/invoices", token)


def get_invoice_by_id(token: str, invoice_id: int):
    return safe_get(f"{ERP_BASE_URL}/invoices/{invoice_id}", token)


def get_users(token: str):
    return safe_get(f"{ERP_BASE_URL}/users", token)