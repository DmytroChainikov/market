from fastapi import FastAPI
from database import engine, Base, get_db
from routers import user, goods
Base.metadata.create_all(bind=engine)
db = next(get_db())
app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}


app.include_router(user.router)
app.include_router(goods.router)