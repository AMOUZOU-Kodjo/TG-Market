import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/shared/contexts/ThemeContext";
import { AuthProvider } from "@/shared/contexts/AuthContext";
import { SocketProvider } from "@/shared/contexts/SocketContext";
import { NotificationProvider } from "@/shared/contexts/NotificationContext";
import { SiteSettingsProvider } from "@/shared/contexts/SiteSettingsContext";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import AdminLayout from "@/layouts/AdminLayout";
import { AuthGuard, GuestGuard, AdminGuard } from "@/guards/AuthGuard";
import { MaintenanceGuard } from "@/guards/MaintenanceGuard";
import { AuthLogoutHandler } from "@/shared/contexts/AuthContext";

import {
  HomePage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
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
  AdminUsersPage,
  AdminListingsPage,
  AdminCategoriesPage,
  AdminPaymentsPage,
  AdminReportsPage,
  AdminSettingsPage,
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
  HistoryPage,
  MakeOfferPage,
  CreateBundlePage,
  BundleDetailPage,
} from "@/routes/lazyPages";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Chargement...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <NotificationProvider>
              <SiteSettingsProvider>
                <BrowserRouter>
                  <AuthLogoutHandler />
                  <MaintenanceGuard>
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route element={<MainLayout />}>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/categories/:slug" element={<CategoryPage />} />
                          <Route path="/vehicules" element={<VehicleListingsPage />} />
                          <Route path="/recherche" element={<SearchResultsPage />} />
                          <Route path="/annonce/:id" element={<ProductDetailPage />} />
                          <Route path="/vendeur/:id" element={<SellerProfilePage />} />
                          <Route path="/vendeurs" element={<SellersPage />} />

                          <Route
                            path="/favoris"
                            element={
                              <AuthGuard>
                                <FavoritesPage />
                              </AuthGuard>
                            }
                          />
                          <Route
                            path="/notifications"
                            element={
                              <AuthGuard>
                                <Navigate to="/dashboard/notifications" replace />
                              </AuthGuard>
                            }
                          />
                          <Route
                            path="/profil"
                            element={
                              <AuthGuard>
                                <Navigate to="/dashboard/profile" replace />
                              </AuthGuard>
                            }
                          />
                          <Route
                            path="/parametres"
                            element={
                              <AuthGuard>
                                <SettingsPage />
                              </AuthGuard>
                            }
                          />
                          <Route
                            path="/portefeuille"
                            element={
                              <AuthGuard>
                                <WalletPage />
                              </AuthGuard>
                            }
                          />
                          <Route path="/avis" element={<ReviewsPage />} />

                          <Route
                            path="/vendre"
                            element={
                              <AuthGuard>
                                <CreateListingPage />
                              </AuthGuard>
                            }
                          />
                          <Route
                            path="/modifier/:id"
                            element={
                              <AuthGuard>
                                <EditListingPage />
                              </AuthGuard>
                            }
                          />

                          <Route path="/a-propos" element={<AboutPage />} />
                          <Route path="/comment-ca-marche" element={<HowItWorksPage />} />
                          <Route path="/contact" element={<ContactPage />} />
                          <Route path="/faq" element={<FAQPage />} />
                          <Route path="/confidentialite" element={<PrivacyPage />} />
                          <Route path="/conditions" element={<TermsPage />} />
                          <Route path="/mentions-legales" element={<LegalNoticesPage />} />
                        </Route>

                        <Route
                          path="/messages"
                          element={
                            <AuthGuard>
                              <MessagesPage />
                            </AuthGuard>
                          }
                        />
                        <Route
                          path="/messages/:conversationId"
                          element={
                            <AuthGuard>
                              <ConversationPage />
                            </AuthGuard>
                          }
                        />
                        <Route
                          path="/acheter/:productId"
                          element={
                            <AuthGuard>
                              <CheckoutPage />
                            </AuthGuard>
                          }
                        />

                        <Route
                          path="/offre/:productId"
                          element={
                            <AuthGuard>
                              <MakeOfferPage />
                            </AuthGuard>
                          }
                        />
                        <Route
                          path="/lot/creer"
                          element={
                            <AuthGuard>
                              <CreateBundlePage />
                            </AuthGuard>
                          }
                        />
                        <Route path="/lot/:id" element={<BundleDetailPage />} />
                        <Route
                          path="/commandes/:id"
                          element={
                            <AuthGuard>
                              <OrderDetailPage />
                            </AuthGuard>
                          }
                        />

                        <Route element={<AuthLayout />}>
                          <Route path="/login" element={<Navigate to="/connexion" replace />} />
                          <Route
                            path="/connexion"
                            element={
                              <GuestGuard>
                                <LoginPage />
                              </GuestGuard>
                            }
                          />
                          <Route
                            path="/inscription"
                            element={
                              <GuestGuard>
                                <RegisterPage />
                              </GuestGuard>
                            }
                          />
                          <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
                        </Route>

                        <Route
                          element={
                            <AuthGuard>
                              <DashboardLayout />
                            </AuthGuard>
                          }
                        >
                          <Route path="/tableau-de-bord" element={<SellerDashboardPage />} />
                          <Route path="/dashboard" element={<SellerDashboardPage />} />
                          <Route
                            path="/dashboard/products"
                            element={<SellerDashboardPage defaultTab="products" />}
                          />
                          <Route
                            path="/dashboard/orders"
                            element={<SellerDashboardPage defaultTab="orders" />}
                          />
                          <Route path="/dashboard/messages" element={<MessagesPage />} />
                          <Route
                            path="/dashboard/notifications"
                            element={<SellerDashboardPage defaultTab="notifications" />}
                          />
                          <Route
                            path="/dashboard/analytics"
                            element={<SellerDashboardPage defaultTab="analytics" />}
                          />
                          <Route
                            path="/dashboard/profile"
                            element={<SellerDashboardPage defaultTab="profile" />}
                          />
                          <Route
                            path="/dashboard/promotions"
                            element={<SellerDashboardPage defaultTab="promotions" />}
                          />
                          <Route
                            path="/dashboard/propositions"
                            element={<SellerDashboardPage defaultTab="bundleProposals" />}
                          />
                          <Route path="/dashboard/settings" element={<SettingsPage />} />
                          <Route path="/dashboard/history" element={<HistoryPage />} />
                        </Route>

                        <Route
                          element={
                            <AdminGuard>
                              <AdminLayout />
                            </AdminGuard>
                          }
                        >
                          <Route path="/admin" element={<AdminDashboardPage />} />
                          <Route path="/admin/users" element={<AdminUsersPage />} />
                          <Route path="/admin/listings" element={<AdminListingsPage />} />
                          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
                          <Route path="/admin/payments" element={<AdminPaymentsPage />} />
                          <Route path="/admin/reports" element={<AdminReportsPage />} />
                          <Route path="/admin/settings" element={<AdminSettingsPage />} />
                        </Route>

                        <Route path="/maintenance" element={<MaintenancePage />} />
                        <Route path="/erreur" element={<ErrorPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </Suspense>
                  </MaintenanceGuard>
                </BrowserRouter>
              </SiteSettingsProvider>

              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "var(--toast-bg, #fff)",
                    color: "var(--toast-color, #1f2937)",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    fontSize: "14px",
                    boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
                  },
                  success: {
                    iconTheme: { primary: "#10B981", secondary: "#fff" },
                  },
                  error: {
                    iconTheme: { primary: "#C8102E", secondary: "#fff" },
                  },
                }}
              />
            </NotificationProvider>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
