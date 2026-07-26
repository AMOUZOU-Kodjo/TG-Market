-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'admin');

-- CreateEnum
CREATE TYPE "ProductCondition" AS ENUM ('new', 'like_new', 'good', 'fair', 'poor');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('active', 'sold', 'expired', 'deleted');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('car', 'moto');

-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('text', 'image', 'offer', 'system');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('sale', 'purchase', 'withdrawal', 'deposit', 'refund');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('completed', 'pending', 'failed');

-- CreateEnum
CREATE TYPE "EscrowStatus" AS ENUM ('pending', 'pending_delivery', 'delivered', 'completed', 'disputed', 'refunded', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('flooz', 'tmoney', 'mobile_money', 'card');

-- CreateEnum
CREATE TYPE "KycDocumentType" AS ENUM ('cni', 'peris', 'passeport');

-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "ProfileVisibility" AS ENUM ('public', 'contacts', 'private');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "avatar" VARCHAR(500),
    "bio" VARCHAR(200),
    "city" VARCHAR(100) NOT NULL,
    "district" VARCHAR(100),
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "email_verified_at" TIMESTAMP(3),
    "phone_verified_at" TIMESTAMP(3),
    "identity_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_professional" BOOLEAN NOT NULL DEFAULT false,
    "is_trusted" BOOLEAN NOT NULL DEFAULT false,
    "preferred_language" VARCHAR(5) NOT NULL DEFAULT 'fr',
    "preferred_currency" VARCHAR(3) NOT NULL DEFAULT 'FCFA',
    "notifications_email" BOOLEAN NOT NULL DEFAULT true,
    "notifications_push" BOOLEAN NOT NULL DEFAULT true,
    "notifications_sms" BOOLEAN NOT NULL DEFAULT false,
    "profile_visibility" "ProfileVisibility" NOT NULL DEFAULT 'public',
    "show_phone" BOOLEAN NOT NULL DEFAULT false,
    "show_location" BOOLEAN NOT NULL DEFAULT true,
    "rating_avg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "product_count" INTEGER NOT NULL DEFAULT 0,
    "follower_count" INTEGER NOT NULL DEFAULT 0,
    "following_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "user_agent" VARCHAR(500),
    "ip_address" VARCHAR(45),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(50) NOT NULL,
    "color" VARCHAR(7) NOT NULL,
    "description" TEXT,
    "image" VARCHAR(500),
    "product_count" INTEGER NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "original_price" INTEGER,
    "condition" "ProductCondition" NOT NULL,
    "brand" VARCHAR(50),
    "city" VARCHAR(100) NOT NULL,
    "neighborhood" VARCHAR(100),
    "negotiable" BOOLEAN NOT NULL DEFAULT false,
    "delivery_available" BOOLEAN NOT NULL DEFAULT false,
    "delivery_price" INTEGER,
    "views" INTEGER NOT NULL DEFAULT 0,
    "favorites_count" INTEGER NOT NULL DEFAULT 0,
    "is_urgent" BOOLEAN NOT NULL DEFAULT false,
    "is_promoted" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "ProductStatus" NOT NULL DEFAULT 'active',
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "has_active_negotiation" BOOLEAN NOT NULL DEFAULT false,
    "search_vector" tsvector,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTag" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "tag" VARCHAR(50) NOT NULL,

    CONSTRAINT "ProductTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSpec" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "value" VARCHAR(255) NOT NULL,

    CONSTRAINT "ProductSpec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "type" "VehicleType" NOT NULL,
    "brand" VARCHAR(50) NOT NULL,
    "model" VARCHAR(50) NOT NULL,
    "year" INTEGER NOT NULL,
    "mileage" INTEGER NOT NULL,
    "fuel" VARCHAR(20) NOT NULL,
    "transmission" VARCHAR(20) NOT NULL,
    "engine_size" VARCHAR(20),
    "horsepower" INTEGER,
    "color" VARCHAR(30),
    "owners" INTEGER,
    "doc_carte_grise" BOOLEAN NOT NULL DEFAULT false,
    "doc_insurance" BOOLEAN NOT NULL DEFAULT false,
    "doc_inspection" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationParticipant" (
    "id" SERIAL NOT NULL,
    "conversation_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "last_read_at" TIMESTAMP(3),
    "unread_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "conversation_id" INTEGER NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "type" "ConversationType" NOT NULL DEFAULT 'text',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "product_id" INTEGER,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "counterparty" VARCHAR(100),
    "status" "TransactionStatus" NOT NULL DEFAULT 'completed',
    "reference_type" VARCHAR(50),
    "reference_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscrowTransaction" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "buyer_id" INTEGER NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "fee" INTEGER NOT NULL,
    "status" "EscrowStatus" NOT NULL DEFAULT 'pending',
    "payment_method" VARCHAR(30),
    "confirmed_at" TIMESTAMP(3),
    "released_at" TIMESTAMP(3),
    "disputed_at" TIMESTAMP(3),
    "dispute_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EscrowTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "provider_user_id" VARCHAR(100),
    "label" VARCHAR(100),
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "reviewer_id" INTEGER NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "product_id" INTEGER,
    "escrow_id" INTEGER,
    "rating" SMALLINT NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" SERIAL NOT NULL,
    "follower_id" INTEGER NOT NULL,
    "following_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KycVerification" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "document_type" "KycDocumentType" NOT NULL,
    "document_front_url" VARCHAR(500) NOT NULL,
    "document_back_url" VARCHAR(500),
    "selfie_url" VARCHAR(500) NOT NULL,
    "status" "KycStatus" NOT NULL DEFAULT 'pending',
    "rejection_reason" TEXT,
    "reviewed_by" INTEGER,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KycVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBadge" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "badge_key" VARCHAR(50) NOT NULL,
    "earned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" SERIAL NOT NULL,
    "question" VARCHAR(500) NOT NULL,
    "answer" TEXT NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductView" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "user_id" INTEGER,
    "ip_address" VARCHAR(45),
    "user_agent" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_city_idx" ON "User"("city");

-- CreateIndex
CREATE INDEX "User_created_at_idx" ON "User"("created_at");

-- CreateIndex
CREATE INDEX "User_is_active_role_idx" ON "User"("is_active", "role");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_user_id_idx" ON "RefreshToken"("user_id");

-- CreateIndex
CREATE INDEX "RefreshToken_token_idx" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_expires_at_idx" ON "RefreshToken"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_is_active_sort_order_idx" ON "Category"("is_active", "sort_order");

-- CreateIndex
CREATE INDEX "Product_user_id_idx" ON "Product"("user_id");

-- CreateIndex
CREATE INDEX "Product_category_id_idx" ON "Product"("category_id");

-- CreateIndex
CREATE INDEX "Product_city_idx" ON "Product"("city");

-- CreateIndex
CREATE INDEX "Product_status_idx" ON "Product"("status");

-- CreateIndex
CREATE INDEX "Product_created_at_idx" ON "Product"("created_at");

-- CreateIndex
CREATE INDEX "Product_price_idx" ON "Product"("price");

-- CreateIndex
CREATE INDEX "Product_status_created_at_idx" ON "Product"("status", "created_at");

-- CreateIndex
CREATE INDEX "ProductImage_product_id_idx" ON "ProductImage"("product_id");

-- CreateIndex
CREATE INDEX "ProductTag_tag_idx" ON "ProductTag"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "ProductTag_product_id_tag_key" ON "ProductTag"("product_id", "tag");

-- CreateIndex
CREATE INDEX "ProductSpec_product_id_idx" ON "ProductSpec"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_product_id_key" ON "Vehicle"("product_id");

-- CreateIndex
CREATE INDEX "Vehicle_brand_model_idx" ON "Vehicle"("brand", "model");

-- CreateIndex
CREATE INDEX "Vehicle_type_idx" ON "Vehicle"("type");

-- CreateIndex
CREATE INDEX "Vehicle_year_idx" ON "Vehicle"("year");

-- CreateIndex
CREATE INDEX "Conversation_updated_at_idx" ON "Conversation"("updated_at");

-- CreateIndex
CREATE INDEX "ConversationParticipant_user_id_idx" ON "ConversationParticipant"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationParticipant_conversation_id_user_id_key" ON "ConversationParticipant"("conversation_id", "user_id");

-- CreateIndex
CREATE INDEX "Message_conversation_id_created_at_idx" ON "Message"("conversation_id", "created_at");

-- CreateIndex
CREATE INDEX "Message_sender_id_idx" ON "Message"("sender_id");

-- CreateIndex
CREATE INDEX "Notification_user_id_read_created_at_idx" ON "Notification"("user_id", "read", "created_at");

-- CreateIndex
CREATE INDEX "WalletTransaction_user_id_created_at_idx" ON "WalletTransaction"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "EscrowTransaction_buyer_id_idx" ON "EscrowTransaction"("buyer_id");

-- CreateIndex
CREATE INDEX "EscrowTransaction_seller_id_idx" ON "EscrowTransaction"("seller_id");

-- CreateIndex
CREATE INDEX "EscrowTransaction_status_idx" ON "EscrowTransaction"("status");

-- CreateIndex
CREATE INDEX "EscrowTransaction_created_at_idx" ON "EscrowTransaction"("created_at");

-- CreateIndex
CREATE INDEX "PaymentMethod_user_id_idx" ON "PaymentMethod"("user_id");

-- CreateIndex
CREATE INDEX "Review_seller_id_idx" ON "Review"("seller_id");

-- CreateIndex
CREATE INDEX "Review_created_at_idx" ON "Review"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "Review_reviewer_id_escrow_id_key" ON "Review"("reviewer_id", "escrow_id");

-- CreateIndex
CREATE INDEX "Favorite_product_id_idx" ON "Favorite"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_user_id_product_id_key" ON "Favorite"("user_id", "product_id");

-- CreateIndex
CREATE INDEX "Follow_following_id_idx" ON "Follow"("following_id");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_follower_id_following_id_key" ON "Follow"("follower_id", "following_id");

-- CreateIndex
CREATE INDEX "KycVerification_status_idx" ON "KycVerification"("status");

-- CreateIndex
CREATE INDEX "KycVerification_user_id_idx" ON "KycVerification"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserBadge_user_id_badge_key_key" ON "UserBadge"("user_id", "badge_key");

-- CreateIndex
CREATE INDEX "Faq_category_is_active_idx" ON "Faq"("category", "is_active");

-- CreateIndex
CREATE INDEX "ProductView_product_id_created_at_idx" ON "ProductView"("product_id", "created_at");

-- CreateIndex
CREATE INDEX "ProductView_user_id_idx" ON "ProductView"("user_id");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTag" ADD CONSTRAINT "ProductTag_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSpec" ADD CONSTRAINT "ProductSpec_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscrowTransaction" ADD CONSTRAINT "EscrowTransaction_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscrowTransaction" ADD CONSTRAINT "EscrowTransaction_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscrowTransaction" ADD CONSTRAINT "EscrowTransaction_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_escrow_id_fkey" FOREIGN KEY ("escrow_id") REFERENCES "EscrowTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycVerification" ADD CONSTRAINT "KycVerification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KycVerification" ADD CONSTRAINT "KycVerification_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadge" ADD CONSTRAINT "UserBadge_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductView" ADD CONSTRAINT "ProductView_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductView" ADD CONSTRAINT "ProductView_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
