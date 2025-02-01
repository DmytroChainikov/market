from fastapi import FastAPI
from database import engine, Base, get_db
from routers import user, goods, reviews, cart, order, tool
from fastapi.middleware.cors import CORSMiddleware


Base.metadata.create_all(bind=engine)
db = next(get_db())
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Marketplace"}

app.include_router(tool.router)
app.include_router(user.router)
app.include_router(goods.router)
app.include_router(reviews.router)
app.include_router(cart.router)
app.include_router(order.router)