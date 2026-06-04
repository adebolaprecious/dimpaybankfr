import React from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Product from './pages/Product'
import LandingPage from './pages/LandingPage'
import About from './pages/About'
import Features from './pages/Features'
import Login from './pages/Login'
import Register from './pages/Register'
import cookie from "universal-cookie";
import Cookies from 'universal-cookie'
import OtpVerification from './pages/OtpVerification'
import Authguard from './Auth/Authguard'
import DashboardOverview from './pages/DashboardOverview'
import NotFound from './pages/NotFound'
import TransferMoney from './pages/Transfer'
import DepositPage from './pages/Deposit'
import CreatePin from './pages/CreatePin'
import WithdrawPage from './pages/Withdraw'
import CardsPage from './pages/Card'
import PayBills from './pages/paybills'
import RecentTransactions from './components/RecentTransactions'
import TransactionHistory from './pages/Transaction'
import SettingsPage from './pages/Settings'
import AdminDashboard from './pages/AdminDashboard'
import AdminRoute from './pages/AdminRoutes'

const App = () =>{
    const cookies = new Cookies();
  const token = cookies.get("token");
    const location = useLocation();
return(
  <>
    {location.pathname !== "/dashboard" && location.pathname !== "/transfer" && location.pathname !== "/transactions" && location.pathname !=="/deposit" && location.pathname !== "/withdraw" && 
 location.pathname !== "/settings" && location.pathname !== "/cards" && location.pathname !== "/paybills" && location.pathname !== "/admin" && <Navbar />}
    
     <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path='/product' element={<Product/>} />
      <Route path='/about-us' element={<About/>} />
        <Route path='/our-features' element={<Features/>} />
         <Route path='/Login' element={<Login/>} />
           <Route path='/register' element={<Register/>} />
           <Route path="/verifyotp" element={<OtpVerification />} />
  <Route  element={<Authguard isAuth={token}/>}>
          <Route path="/dashboard" element={<DashboardOverview/>} />
           <Route path="/transfer" element={<TransferMoney />} />
           <Route path="/deposit" element={<DepositPage />} />
           <Route path="/create-pin" element={<CreatePin />} />
           <Route path="/withdraw" element={<WithdrawPage />} />
           <Route path="/cards" element={<CardsPage />} />
               <Route path="/paybills" element={<PayBills />} />
                <Route path="/recenttransactions" element={<RecentTransactions />} />
                 <Route path="/transactions" element={<TransactionHistory />} />
                 <Route path="/settings" element={<SettingsPage/>} />
                 <Route path="/admin" element={
  <AdminRoute>
    <AdminDashboard />
  </AdminRoute>
} />
         </Route>



            <Route path="*" element={<NotFound />} />
     </Routes>
        
  </>
)
}
export default App
