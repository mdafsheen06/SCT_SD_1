from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConvertRequest(BaseModel):
    value: float
    unit: str

@app.post("/api/convert")
def convert_temperature(request: ConvertRequest):
    value = request.value
    unit = request.unit.lower()

    if unit == 'celsius':
        celsius = value
        fahrenheit = (value * 9/5) + 32
        kelvin = value + 273.15
    elif unit == 'fahrenheit':
        celsius = (value - 32) * 5/9
        fahrenheit = value
        kelvin = celsius + 273.15
    elif unit == 'kelvin':
        celsius = value - 273.15
        fahrenheit = (celsius * 9/5) + 32
        kelvin = value
    else:
        return {"error": "Invalid unit"}

    return {
        "celsius": round(celsius, 2),
        "fahrenheit": round(fahrenheit, 2),
        "kelvin": round(kelvin, 2)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
