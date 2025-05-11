from fastapi import FastAPI
from database import engine, Base, get_db
from routers import user, goods, reviews, cart, order, tool
from fastapi.middleware.cors import CORSMiddleware
# from apscheduler.schedulers.background import BackgroundScheduler
# from apscheduler.triggers.cron import CronTrigger
from services.get_products import get_products

Base.metadata.create_all(bind=engine)
db = next(get_db())
app = FastAPI()
# get_products(db)
# scheduler = BackgroundScheduler()

# scheduler.add_job(
#     get_products,
#     trigger=CronTrigger(hour=10, minute=0),  # Або `day="*"` для щоденного запуску
#     name="get_products"
# )

# @app.on_event("startup")
# async def startup_event():
#     if not scheduler.running:
#         scheduler.start()

# @app.on_event("shutdown")
# async def shutdown_event():
#     if scheduler.running:
#         scheduler.shutdown()

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