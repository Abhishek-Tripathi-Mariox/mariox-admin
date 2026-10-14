import { configureStore } from "@reduxjs/toolkit";
import globalSlice from "../store/globalSlice";
import countryReducer from "../pages/admin/ManageCountry/countrySlice";
import faqSlice from "../pages/admin/ManageFaqs/faqSlice";
import cityReducer from "../pages/admin/ManageCity/citySlice";
import serviceReducer from "../pages/admin/ManageServices/serviceSlice";
import serviceCitiesReducer from "../pages/admin/ManageServicesCities/serviceCitiesSlice";
import cityFAQReducer from "../pages/admin/ManageCityFAQs/cityFAQSlice";
import specializationCityFAQReducer from "../pages/admin/ManageSpecializationCityFAQs/specializationCityFAQSlice";
import serviceFAQReducer from "../pages/admin/ManageServiceFAQs/serviceFAQSlice";
import serviceContentReducer from "../pages/admin/ManageServicesContent/serviceContentSlice";
import serviceCityContentReducer from "../pages/admin/ManageServicesCityContent/serviceCityContentSlice";
import inquiresReducer from "../pages/admin/ManageInquires/inquiresSlice";
import subAdminsReducer from "../pages/admin/ManageSubAdmins/subAdminsSlice";
import logsReducer from "../pages/admin/ManageLogs/LogsSlice";
import serviceCityCompanyReducer from "../pages/admin/ManageServiceCityCompanies/serviceCityCompaniesSlice";
import serviceDescriptionReducer from "../pages/admin/ManageServiceDescription/serviceDescriptionSlice";
import serviceCompanyDescriptionReducer from "../pages/admin/ManageServiceCompanyDescription/serviceCompanyDescriptionSlice";
import serviceCompanyReducer from "../pages/admin/ManageServiceCompanies/serviceCompanySlice";
import serviceCompanyServicesReducer from "../pages/admin/ManageServiceCompanyServices/serviceCompanyServicesSlice";

export const store = configureStore({
  reducer: {
    global: globalSlice,
    country: countryReducer,
    city: cityReducer,
    faq: faqSlice,
    cityFAQ: cityFAQReducer,
    serviceFAQ: serviceFAQReducer,
    service: serviceReducer,
    specializationCityFAQ: specializationCityFAQReducer,
    serviceCity: serviceCitiesReducer,
    serviceContent: serviceContentReducer,
    inquires: inquiresReducer,
    serviceCityContent: serviceCityContentReducer,
    subAdminsReducer: subAdminsReducer,
    logs: logsReducer,
    serviceCityCompany: serviceCityCompanyReducer,
    serviceDescription: serviceDescriptionReducer,
    serviceCompanyDescription: serviceCompanyDescriptionReducer,
    serviceCompany: serviceCompanyReducer,
    serviceCompanyServices: serviceCompanyServicesReducer,
  },
});
