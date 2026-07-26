import { lazy } from "react";

const HomePage = lazy(() => import("@/features/home/pages/HomePage"));
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("@/features/auth/pages/ForgotPasswordPage"));
const CategoriesPage = lazy(() => import("@/features/categories/pages/CategoriesPage"));
const CategoryPage = lazy(() => import("@/features/categories/pages/CategoryPage"));
const SearchResultsPage = lazy(() => import("@/features/search/pages/SearchResultsPage"));
const ProductDetailPage = lazy(() => import("@/features/products/pages/ProductDetailPage"));
const CreateListingPage = lazy(() => import("@/features/listings/pages/CreateListingPage"));
const EditListingPage = lazy(() => import("@/features/listings/pages/EditListingPage"));
const SellerProfilePage = lazy(() => import("@/features/profile/pages/SellerProfilePage"));
const SellersPage = lazy(() => import("@/features/profile/pages/SellersPage"));
const UserProfilePage = lazy(() => import("@/features/profile/pages/UserProfilePage"));
const SellerDashboardPage = lazy(() => import("@/features/dashboard/pages/SellerDashboardPage"));
const MessagesPage = lazy(() => import("@/features/chat/pages/MessagesPage"));
const ConversationPage = lazy(() => import("@/features/chat/pages/ConversationPage"));
const FavoritesPage = lazy(() => import("@/features/favorites/pages/FavoritesPage"));
const NotificationsPage = lazy(() => import("@/features/notifications/pages/NotificationsPage"));
const SettingsPage = lazy(() => import("@/features/settings/pages/SettingsPage"));
const WalletPage = lazy(() => import("@/features/wallet/pages/WalletPage"));
const ReviewsPage = lazy(() => import("@/features/reviews/pages/ReviewsPage"));
const AdminDashboardPage = lazy(() => import("@/features/admin/pages/AdminDashboardPage"));
const AboutPage = lazy(() => import("@/features/static/pages/AboutPage"));
const FAQPage = lazy(() => import("@/features/static/pages/FAQPage"));
const PrivacyPage = lazy(() => import("@/features/static/pages/PrivacyPage"));
const TermsPage = lazy(() => import("@/features/static/pages/TermsPage"));
const LegalNoticesPage = lazy(() => import("@/features/static/pages/LegalNoticesPage"));
const NotFoundPage = lazy(() => import("@/features/static/pages/NotFoundPage"));
const ErrorPage = lazy(() => import("@/features/static/pages/ErrorPage"));
const MaintenancePage = lazy(() => import("@/features/static/pages/MaintenancePage"));
const VehicleListingsPage = lazy(() => import("@/features/vehicles/pages/VehicleListingsPage"));
const HowItWorksPage = lazy(() => import("@/features/static/pages/HowItWorksPage"));
const ContactPage = lazy(() => import("@/features/static/pages/ContactPage"));
const CheckoutPage = lazy(() => import("@/features/payment/pages/CheckoutPage"));
const OrderDetailPage = lazy(() => import("@/features/payment/pages/OrderDetailPage"));

export {
  HomePage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  CategoriesPage,
  CategoryPage,
  SearchResultsPage,
  ProductDetailPage,
  CreateListingPage,
  EditListingPage,
  SellerProfilePage,
  SellersPage,
  UserProfilePage,
  SellerDashboardPage,
  MessagesPage,
  ConversationPage,
  FavoritesPage,
  NotificationsPage,
  SettingsPage,
  WalletPage,
  ReviewsPage,
  AdminDashboardPage,
  AboutPage,
  FAQPage,
  PrivacyPage,
  TermsPage,
  LegalNoticesPage,
  NotFoundPage,
  ErrorPage,
  MaintenancePage,
  VehicleListingsPage,
  HowItWorksPage,
  ContactPage,
  CheckoutPage,
  OrderDetailPage,
};
