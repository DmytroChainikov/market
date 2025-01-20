from fastapi import FastAPI
from database import engine, Base, get_db
from routers import user, goods, reviews, cart, order, tool
Base.metadata.create_all(bind=engine)
db = next(get_db())
app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(tool.router)
app.include_router(user.router)
app.include_router(goods.router)
app.include_router(reviews.router)
app.include_router(cart.router)
app.include_router(order.router)