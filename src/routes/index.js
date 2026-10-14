import AddCountry from "../pages/admin/ManageCountry/addCountry";
import EditCountry from "../pages/admin/ManageCountry/editCountry";
import CountryDetail from "../pages/admin/ManageCountry/countryDetails";
import CountriesList from "../pages/admin/ManageCountry/countryList";
import AddService from "../pages/admin/ManageServices/addServices";
import EditService from "../pages/admin/ManageServices/editService";
import ServiceDetail from "../pages/admin/ManageServices/serviceDetails";
import ServiceList from "../pages/admin/ManageServices/serviceList";
import AddServiceCity from "../pages/admin/ManageServicesCities/addServiceCities";
import EditServiceCity from "../pages/admin/ManageServicesCities/editServiceCities";
import ServiceCityDetail from "../pages/admin/ManageServicesCities/serviceCitiesDetails";
import ServiceCityList from "../pages/admin/ManageServicesCities/serviceCitiesList";
import AddCity from "../pages/admin/ManageCity/addCity";
import EditCity from "../pages/admin/ManageCity/editCity";
import CityDetail from "../pages/admin/ManageCity/cityDetails";
import CityList from "../pages/admin/ManageCity/cityList";
import ChangePassword from "../pages/admin/Setting/changePassword";
import ForgotPassword from "../pages/auth/ForgetPassword";
import Login from "../pages/auth/Login";
import OTP from "../pages/auth/Otp";
import ResetPassword from "../pages/auth/ResetPassword";

import AddCityFAQ from "../pages/admin/ManageCityFAQs/addCityFAQs";
import EditCityFAQ from "../pages/admin/ManageCityFAQs/editCityFAQs";
import CityFAQDetail from "../pages/admin/ManageCityFAQs/cityFAQsDetails";
import CityFAQList from "../pages/admin/ManageCityFAQs/cityFAQSList";

import AddServiceFAQ from "../pages/admin/ManageServiceFAQs/addServiceFAQs";
import EditServiceFAQ from "../pages/admin/ManageServiceFAQs/editServiceFAQs";
import ServiceFAQDetail from "../pages/admin/ManageServiceFAQs/serviceFAQsDetails";
import ServiceFAQList from "../pages/admin/ManageServiceFAQs/serviceFAQsList";

import AddSpecializationCityFAQ from "../pages/admin/ManageSpecializationCityFAQs/addSpecializationCityFAQs";
import EditSpecializationCityFAQ from "../pages/admin/ManageSpecializationCityFAQs/editSpecializationCityFAQs";
import SpecializationCityFAQDetail from "../pages/admin/ManageSpecializationCityFAQs/specializationCityFAQsDetails";
import SpecializationCityFAQList from "../pages/admin/ManageSpecializationCityFAQs/specializationCityFAQList";

import AddServiceContent from "../pages/admin/ManageServicesContent/addServiceContent";
import EditServiceContent from "../pages/admin/ManageServicesContent/editServiceContent";
import ServiceContentDetail from "../pages/admin/ManageServicesContent/serviceContentDetails";
import ServiceContentList from "../pages/admin/ManageServicesContent/serviceContentList";
import ServiceContentEditor from "../pages/admin/ManageServicesContent/ServiceContentEditor";

import AddServiceCityContent from "../pages/admin/ManageServicesCityContent/addServiceCityContent";
import EditServiceCityContent from "../pages/admin/ManageServicesCityContent/editServiceCityContent";
import ServiceCityContentDetail from "../pages/admin/ManageServicesCityContent/serviceCityContentDetails";
import ServiceCityContentList from "../pages/admin/ManageServicesCityContent/serviceCityContentList";

import InquiresDetail from "../pages/admin/ManageInquires/inquiresDetails";
import InquiresList from "../pages/admin/ManageInquires/inquiresList";

import LogsList from "../pages/admin/ManageLogs/LogsList";

// import AddSubAdmin from "../pages/admin/ManageSubAdmins/addSubAdmins";
// import EditSubAdmin from "../pages/admin/ManageSubAdmins/editSubAdmins";
// import SubAdminDetail from "../pages/admin/ManageSubAdmins/subAdminDetails";
// import SubAdminsList from "../pages/admin/ManageSubAdmins/subAdminList";

import ServiceCityCompaniesList from "../pages/admin/ManageServiceCityCompanies/ServiceCityCompaniesList";
import AddServiceCityCompany from "../pages/admin/ManageServiceCityCompanies/AddServiceCityCompany";

import AddServiceDescription from "../pages/admin/ManageServiceDescription/addServiceDescription";
import EditServiceDescription from "../pages/admin/ManageServiceDescription/editServiceDescription";
import ServiceDescriptionDetail from "../pages/admin/ManageServiceDescription/serviceDescriptionDetails";
import ServiceDescriptionList from "../pages/admin/ManageServiceDescription/serviceDescriptionList";

import AddServiceCompanyDescription from "../pages/admin/ManageServiceCompanyDescription/addServiceCompanyDescription";
import EditServiceCompanyDescription from "../pages/admin/ManageServiceCompanyDescription/editServiceCompanyDescription";
import ServiceCompanyDescriptionDetail from "../pages/admin/ManageServiceCompanyDescription/serviceCompanyDescriptionDetails";
import ServiceCompanyDescriptionList from "../pages/admin/ManageServiceCompanyDescription/serviceCompanyDescriptionList";

import AddServiceCompany from "../pages/admin/ManageServiceCompanies/addServiceCompany";
import EditServiceCompany from "../pages/admin/ManageServiceCompanies/editServiceCompany";
import ServiceCompanyDetail from "../pages/admin/ManageServiceCompanies/serviceCompanyDetails";
import ServiceCompanyList from "../pages/admin/ManageServiceCompanies/serviceCompanyList";
import ManageServiceCompanyServices from "../pages/admin/ManageServiceCompanyServices/serviceCompanyServicesList";
import ServiceCompanyServicesDetails from "../pages/admin/ManageServiceCompanyServices/serviceCompanyServicesDetails";
import EditServiceCompanyServices from "../pages/admin/ManageServiceCompanyServices/editServiceCompanyServices";
import AddServiceCompanyServices from "../pages/admin/ManageServiceCompanyServices/addServiceCompanyServices";

export const authRoutes = [
  {
    path: "auth/login",
    element: Login,
  },
  {
    path: "auth/forget-password",
    element: ForgotPassword,
  },
  {
    path: "auth/otp-input",
    element: OTP,
  },
  {
    path: "auth/reset-password",
    element: ResetPassword,
  },
];

export const router = [
  // {
  //   name: "Manage Admins",
  //   path: "/admin/manage-subAdmins/add",
  //   element: AddSubAdmin,
  //   hidden: true,
  // },
  // {
  //   name: "Manage Admins",
  //   path: "/admin/manage-subAdmins/edit/:id",
  //   element: EditSubAdmin,
  //   hidden: true,
  // },
  // {
  //   name: "Manage Admins",
  //   path: "/admin/manage-subAdmins/details/:id",
  //   element: SubAdminDetail,
  //   hidden: true,
  // },
  // {
  //   name: "Manage Admins",
  //   path: "/admin/manage-subAdmins",
  //   element: SubAdminsList,
  //   hidden: false,
  //   img1: "assets/images/products.png",
  //   img2: "assets/images/products-selected.png",
  // },
  {
    name: "Manage Countries",
    path: "/admin/manage-countries/add",
    element: AddCountry,
    hidden: true,
  },
  {
    name: "Manage Countries",
    path: "/admin/manage-countries/edit/:id",
    element: EditCountry,
    hidden: true,
  },
  {
    name: "Manage Countries",
    path: "/admin/manage-countries/details/:id",
    element: CountryDetail,
    hidden: true,
  },
  {
    name: "Manage Countries",
    path: "/admin/manage-countries",
    element: CountriesList,
    hidden: false,
    img1: "assets/images/products.png",
    img2: "assets/images/products-selected.png",
  },
  {
    name: "Manage Cities",
    path: "/admin/manage-cities/add",
    element: AddCity,
    hidden: true,
  },
  {
    name: "Manage Cities",
    path: "/admin/manage-cities/edit/:id",
    element: EditCity,
    hidden: true,
  },
  {
    name: "Manage Cities",
    path: "/admin/manage-cities/details/:id",
    element: CityDetail,
    hidden: true,
  },
  {
    name: "Manage Cities",
    path: "/admin/manage-cities",
    element: CityList,
    hidden: false,
    img1: "assets/images/products.png",
    img2: "assets/images/products-selected.png",
  },
  {
    name: "Manage Services",
    path: "/admin/manage-services/add",
    element: AddService,
    hidden: true,
  },
  {
    name: "Manage Services",
    path: "/admin/manage-services/edit/:id",
    element: EditService,
    hidden: true,
  },
  {
    name: "Manage Services",
    path: "/admin/manage-services/details/:id",
    element: ServiceDetail,
    hidden: true,
  },
  {
    name: "Manage Services",
    path: "/admin/manage-services",
    element: ServiceList,
    hidden: false,
    img1: "assets/images/products.png",
    img2: "assets/images/products-selected.png",
  },
  {
    name: "Manage Service Companies",
    path: "/admin/manage-service-company/add",
    element: AddServiceCompany,
    hidden: true,
  },
  {
    name: "Manage Service Companies",
    path: "/admin/manage-service-company/edit/:id",
    element: EditServiceCompany,
    hidden: true,
  },
  {
    name: "Manage Service Companies",
    path: "/admin/manage-service-company/details/:id",
    element: ServiceCompanyDetail,
    hidden: true,
  },
  {
    name: "Manage Service Companies",
    path: "/admin/manage-service-company",
    element: ServiceCompanyList,
    hidden: false,
    img1: "assets/images/products.png",
    img2: "assets/images/products-selected.png",
  },
  {
    name: "Manage Service Images",
    path: "/admin/manage-services-content/add",
    element: AddServiceContent,
    hidden: true,
  },
  {
    name: "Manage Service Images",
    path: "/admin/manage-services-content/edit/:id",
    element: EditServiceContent,
    hidden: true,
  },
  {
    name: "Manage Service Images",
    path: "/admin/manage-services-content/details/:id",
    element: ServiceContentDetail,
    hidden: true,
  },
  {
    name: "Manage Service Images",
    path: "/admin/manage-services-content",
    element: ServiceContentList,
    hidden: true,
    img1: "assets/images/products.png",
    img2: "assets/images/products-selected.png",
  },
  {
    name: "Manage Service Images",
    path: "/admin/manage-services/content/:serviceId",
    element: ServiceContentEditor,
    hidden: true,
    img1: "assets/images/products.png",
    img2: "assets/images/products-selected.png",
  },
  {
    name: "Manage Service Cities",
    path: "/admin/manage-serviceCities/add",
    element: AddServiceCity,
    hidden: true,
  },
  {
    name: "Manage Service Cities",
    path: "/admin/manage-serviceCities/edit/:id",
    element: EditServiceCity,
    hidden: true,
  },
  {
    name: "Manage Service Cities",
    path: "/admin/manage-serviceCities/details/:id",
    element: ServiceCityDetail,
    hidden: true,
  },
  {
    name: "Manage Service Cities",
    path: "/admin/manage-serviceCities",
    element: ServiceCityList,
    hidden: false,
    img1: "assets/images/products.png",
    img2: "assets/images/products-selected.png",
  },
  {
    name: "Manage Service City Companies",
    path: "/admin/manage-service-city-companies/add",
    element: AddServiceCityCompany,
    hidden: true,
  },
  {
    name: "Manage Service City Companies",
    path: "/admin/manage-service-city-companies",
    element: ServiceCityCompaniesList,
    hidden: false,
    img1: "assets/images/products.png",
    img2: "assets/images/products-selected.png",
  },
  {
    name: "Manage Service Description",
    path: "/admin/manage-service-description/add/:serviceId",
    element: AddServiceDescription,
    hidden: true,
  },
  {
    name: "Manage Service Description",
    path: "/admin/manage-service-description/edit/:id",
    element: EditServiceDescription,
    hidden: true,
  },
  {
    name: "Manage Service Description",
    path: "/admin/manage-service-description/details/:id",
    element: ServiceDescriptionDetail,
    hidden: true,
  },
  {
    name: "Manage Service Description",
    path: "/admin/manage-service-description/:serviceId",
    element: ServiceDescriptionList,
    hidden: true,
    img1: "assets/images/products.png",
    img2: "assets/images/products-selected.png",
  },
  {
    name: "Manage Service Company Description",
    path: "/admin/manage-service-company-description/add/:serviceCompanyId",
    element: AddServiceCompanyDescription,
    hidden: true,
  },
  {
    name: "Manage Service Company Description",
    path: "/admin/manage-service-company-description/edit/:id/:serviceCompanyId",
    element: EditServiceCompanyDescription,
    hidden: true,
  },
  {
    name: "Manage Service Company Description",
    path: "/admin/manage-service-company-description/details/:id",
    element: ServiceCompanyDescriptionDetail,
    hidden: true,
  },
  {
    name: "Manage Service Company Description",
    path: "/admin/manage-service-company-description/:serviceCompanyId",
    element: ServiceCompanyDescriptionList,
    hidden: true,
    img1: "assets/images/products.png",
    img2: "assets/images/products-selected.png",
  },
  {
    name: "Manage Services",
    path: "/admin/manage-global-services",
    element: ManageServiceCompanyServices, // global list page
    hidden: true,
  },
  {
    name: "Manage Services",
    path: "/admin/manage-global-services/add",
    element: AddServiceCompanyServices,
    hidden: true,
  },
  {
    name: "Manage Services",
    path: "/admin/manage-global-services/edit/:id",
    element: EditServiceCompanyServices,
    hidden: true,
  },
  {
    name: "Manage Services",
    path: "/admin/manage-global-services/details/:id",
    element: ServiceCompanyServicesDetails,
    hidden: true,
  },
  {
    name: "Manage Service City Content",
    path: "/admin/manage-service-cities-content/add",
    element: AddServiceCityContent,
    hidden: true,
  },
  {
    name: "Manage Service City Content",
    path: "/admin/manage-service-cities-content/edit/:id",
    element: EditServiceCityContent,
    hidden: true,
  },
  {
    name: "Manage Service City Content",
    path: "/admin/manage-service-cities-content/details/:id",
    element: ServiceCityContentDetail,
    hidden: true,
  },
  {
    name: "Manage Service City Content",
    path: "/admin/manage-service-cities-content",
    element: ServiceCityContentList,
    hidden: true,
    img1: "assets/images/products.png",
    img2: "assets/images/products-selected.png",
  },
  {
    name: "Manage City FAQs",
    path: "/admin/manage-city-faqs/add",
    element: AddCityFAQ,
    hidden: true,
  },
  {
    name: "Manage City FAQs",
    path: "/admin/manage-city-faqs/edit/:id",
    element: EditCityFAQ,
    hidden: true,
  },
  {
    name: "Manage City FAQs",
    path: "/admin/manage-city-faqs/details/:id",
    element: CityFAQDetail,
    hidden: true,
  },
  {
    name: "Manage City FAQs",
    path: "/admin/manage-city-faqs",
    element: CityFAQList,
    hidden: false,
    img1: "assets/images/products.png",
    img2: "assets/images/products-selected.png",
  },
  {
    name: "Manage Service FAQs",
    path: "/admin/manage-service-faqs/add",
    element: AddServiceFAQ,
    hidden: true,
  },
  {
    name: "Manage Service FAQs",
    path: "/admin/manage-service-faqs/edit/:id",
    element: EditServiceFAQ,
    hidden: true,
  },
  {
    name: "Manage Service FAQs",
    path: "/admin/manage-service-faqs/details/:id",
    element: ServiceFAQDetail,
    hidden: true,
  },
  {
    name: "Manage Service FAQs",
    path: "/admin/manage-service-faqs",
    element: ServiceFAQList,
    hidden: false,
    img1: "assets/images/products.png",
    img2: "assets/images/products-selected.png",
  },
  // {
  //   name: "Manage Faqs",
  //   path: "/admin/faqs/edit/:id",
  //   element: EditFaqs,
  //   hidden: true,
  // },
  // {
  //   name: "Manage Faqs",
  //   path: "/admin/faqs/add",
  //   element: AddFaq,
  //   hidden: true,
  // },
  // {
  //   name: "Manage Faqs",
  //   path: "/admin/faqs",
  //   element: FaqList,
  //   hidden: false,
  //   img1: "assets/images/Manage-Faqs.png",
  //   img2: "assets/images/Manage-Faqs-selected.png",
  // },
  {
    name: "Manage Service City FAQs",
    path: "/admin/manage-specializations-city-faqs/add",
    element: AddSpecializationCityFAQ,
    hidden: true,
  },
  {
    name: "Manage Service City FAQs",
    path: "/admin/manage-specializations-city-faqs/edit/:id",
    element: EditSpecializationCityFAQ,
    hidden: true,
  },
  {
    name: "Manage Service City FAQs",
    path: "/admin/manage-specializations-city-faqs/details/:id",
    element: SpecializationCityFAQDetail,
    hidden: true,
  },
  {
    name: "Manage Service City FAQs",
    path: "/admin/manage-specializations-city-faqs",
    element: SpecializationCityFAQList,
    hidden: false,
    img1: "assets/images/products.png",
    img2: "assets/images/products-selected.png",
  },
  {
    name: "Manage Inquires",
    path: "/admin/manage-inquires/details/:id",
    element: InquiresDetail,
    hidden: true,
  },
  {
    name: "Manage Inquires",
    path: "/admin/manage-inquires",
    element: InquiresList,
    hidden: false,
    img1: "assets/images/products.png",
    img2: "assets/images/products-selected.png",
  },
  {
    name: "Manage Logs",
    path: "/admin/manage-logs",
    element: LogsList,
    hidden: false,
    img1: "assets/images/products.png",
    img2: "assets/images/products-selected.png",
  },
  {
    name: "Setting",
    path: "/admin/setting",
    hidden: false,
    img1: "assets/images/Settings.png",
    img2: "assets/images/Settings-selected.png",
    state: "setting",
    collapse: true,
    child: [
      {
        name: "Change Password",
        path: "/admin/setting/change-password",
        element: ChangePassword,
        hidden: false,
        img1: "assets/images/dashboard.png",
        img2: "assets/images/dashboard-selected.png",
      },
      {
        name: "Logout",
        path: "/auth/login",
        hidden: false,
        img1: "assets/images/dashboard.png",
        img2: "assets/images/dashboard-selected.png",
      },
    ],
  },
];
