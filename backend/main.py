from fastapi import FastAPI

app = FastAPI(title="FileHub")

@app.get("/")
def home():
    return {
        "message": "Welcome to FileHub 🚀"
    }