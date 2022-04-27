import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Cart } from "./pages/Cart";
import { Header } from "./pages/Header";
import { Footer } from "./pages/Footer";
import { Checkout } from "./pages/Checkout";
// import { BrowserRouter } from 'react-router-dom';
// import { HomeScreen } from "./screens/HomeScreen";
import { Authenticateuser, AuthenticateAdmin } from "./protectorRoutes";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Collection } from "./pages/Collection";
import { ProductIndividual } from "./pages/Productdetails";
import { CreateDiscount } from "./Admin/createDiscount";
import { Addproduct } from "./Admin/addproduct";
import { Editproduct } from "./Admin/editproducts";
import { Admindashboard } from "./Admin/adminDashboard";
import { Orders } from "./Admin/orderadmin";
import { Orderdetail } from "./Admin/orderdetails";
import { DiscountList } from "./Admin/discountlistpage";
import { Editdiscount } from "./Admin/editdiscount";
import { Ordersuccess } from "./pages/ordersuccess";
import { Orderbill } from "./pages/orderDetails";
import { NotFound } from "./pages/NotFound";
import { Myorders } from "./pages/orderlist";
import { Checkinventory } from "./pages/checkoutfn/checkinventory";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* <Header /> */}
        <Routes>
          <Route path="/notfound" element={NotFound} />
          <Route
            path="/collections"
            element={<Authenticateuser component={Collection} />}
          />
          <Route
            path="/products/:productid"
            element={<Authenticateuser component={ProductIndividual} />}
          />
          <Route path="/cart" element={<Authenticateuser component={Cart} />} />
          {/* <Route path="*" exact={true} element={<NotFound />} /> */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/checkout"
            element={<Authenticateuser component={Checkout} />}
          />
          <Route
            path="/checkout/:orderno"
            element={<Authenticateuser component={Checkout} />}
          />

          <Route
            path="/success/:orderno"
            element={<Authenticateuser component={Ordersuccess} />}
          />
          <Route
            path="/orderbill/:orderid"
            element={<Authenticateuser component={Orderbill} />}
          />
          <Route
            path="/myorders/:userid"
            element={<Authenticateuser component={Myorders} />}
          />

          <Route
            path="/creatediscount"
            element={<AuthenticateAdmin component={CreateDiscount} />}
          />
          <Route
            path="/addproducts"
            element={<AuthenticateAdmin component={Addproduct} />}
          />
          <Route
            path="/editproducts/:id"
            element={<AuthenticateAdmin component={Editproduct} />}
          />
          <Route
            path="/admindashboard"
            element={<AuthenticateAdmin component={Admindashboard} />}
          />
          <Route
            path="/orders"
            element={<AuthenticateAdmin component={Orders} />}
          />
          <Route
            path="/orderdetails/:orderid"
            element={<AuthenticateAdmin component={Orderdetail} />}
          />
          <Route
            path="/discounts"
            element={<AuthenticateAdmin component={DiscountList} />}
          />
          <Route
            path="/editdiscounts/:id"
            element={<AuthenticateAdmin component={Editdiscount} />}
          />

          <Route
            path="/checkinventory/:id"
            element={<Authenticateuser component={Checkinventory} />}
          />
        </Routes>
        {/* <Footer /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
