-- CreateTable
CREATE TABLE "ratings" (
    "id_rating" SERIAL NOT NULL,
    "rating" VARCHAR(100) NOT NULL,
    "comment" VARCHAR(100) NOT NULL,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id_rating")
);
