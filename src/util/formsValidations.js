// @flow

import * as Yup from 'yup';

class FormsValidations {
  walkInCustomer = Yup.object().shape({
    mobile: Yup.string()
      .required('Please enter')
      .min(10, 'Please enter a valid mobile number')
      .matches('^[0-9]*$', 'Please enter mobile number'),
  });

  vinNumber = Yup.object().shape({
    vinScanField: Yup.string()
      .required('Please enter')
      .min(17, 'Please enter a valid VIN number')
      .matches('^[a-zA-Z0-9][^oiqOIQ]*$', 'Please enter a valid VIN number'),
  });

  vinIdentification = Yup.object().shape({
    mileage: Yup.string()
      .required('Required')
      .max(8, 'Please enter Valid mileage')
      .matches('^[0-9]*$', 'Please enter valid mileage'),
    regNo: Yup.string()
      .required('Required')
      .min(8, 'Please enter a valid Serial number')
      .matches('^[0-9]*$', 'Please enter a valid Serial number'),
    plateNo: Yup.string()
      .required('Required')
      .max(4, 'Please enter a valid Plate number')
      .matches('^[0-9]*$', 'Please enter a valid Plate number'),
    color: Yup.string().required('Required'),
    plateEN1: Yup.string().required('Required'),
    plateEN2: Yup.string().required('Required'),
    plateEN3: Yup.string().required('Required'),
  });

  vehicleInformation = Yup.object().shape({
    vinScanField: Yup.string()
      .required('Please enter')
      .min(17, 'Please enter a valid VIN number')
      .matches('^[a-zA-Z0-9][^oiqOIQ]*$', 'Please enter a valid VIN number'),
    make: Yup.string().required('Manufacturer is Required'),
    type: Yup.string().required('Vehicle Type Required'),
    model: Yup.string().required('Vehicle Model Required'),
    yearMake: Yup.string().required('Make Year Required'),
  });
}

export default FormsValidations;
