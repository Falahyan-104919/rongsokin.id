import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useContext, useState } from 'react';
import { AuthContext } from '../../store/AuthProvider';
import * as Yup from 'yup';
import { AttachmentIcon, SmallCloseIcon } from '@chakra-ui/icons';
import axiosInstance from '../../utils/axios';

export default function AddProductsModal({ open, toggleOff }) {
  const { user } = useContext(AuthContext);
  const [uploadProductImage, setUploadProductImage] = useState([]);
  const toast = useToast();
  const pengumpulProductType = [
    'Kertas/Kardus',
    'Besi/Logam',
    'Kaca/Beling',
    'Plastik',
    'Elektronik',
    'Barang Tekstil',
    'Bahan Bangunan',
  ];
  const pengelolaProductType = [
    'Bahan Kertas Daur Ulang',
    'Bahan Besi/Logam Daur Ulang',
    'Bahan Kaca/Beling Daur Ulang',
    'Bahan Plastik Daur Ulang',
    'Bahan Elektronik Daur Ulang',
    'Bahan Tekstil Daur Ulang',
    'Bahan Bangunan Daur Ulang',
  ];

  const initialValues = {
    productName: '',
    productType: '',
    descriptionProduct: '',
    productPrice: '',
    productQuantity: '',
    productImage: [],
  };

  const validationSchema = Yup.object().shape({
    productName: Yup.string()
      .min(10, 'Product Name is Need at least 10 Character')
      .required('Product Name is Required'),
    productType: Yup.string().required('Product Type is Required'),
    descriptionProduct: Yup.string()
      .min(20, 'Product Description is Need at least 20 Character')
      .required('Product Description is Required'),
    productPrice: Yup.number('Product Price is Must Be a Number Types')
      .required('Product price is Required')
      .positive('Product Price is Must Be a Positive Number'),
    productQuantity: Yup.number('Product Quantity is Must Be a Number Types')
      .required('Product Quantity is Required')
      .positive('Product Quantity is Must Be a Positive Number'),
    productImage: Yup.array()
      .required('Product Image is Required')
      .min(1, 'Minimum 1 Product Images')
      .max(5, 'Maximum 5 Product Images'),
  });

  const formData = new FormData();
  const resetFormData = (formData) => {
    for (var key of formData.keys()) {
      formData.delete(key);
    }
  };

  const postProduct = async (
    {
      productName,
      productType,
      descriptionProduct,
      productPrice,
      productQuantity,
    },
    uploadProductImage
  ) => {
    formData.set('mitraId', user.mitraId);
    formData.set('userId', user.userId);
    formData.set('name', productName);
    formData.set('productType', productType);
    formData.set('description', descriptionProduct);
    formData.set('price', parseInt(productPrice));
    formData.set('quantity', parseInt(productQuantity));
    formData.append('productImg', uploadProductImage[0], uploadProductImage[0]);
    const response = await axiosInstance
      .post(`products/upload/${user.mitraId}`, formData)
      .then((res) => {
        return {
          status: res.status,
          message: res.data.message,
        };
      })
      .catch((err) => {
        return {
          status: err.response.status,
          message: err.response.data.message,
        };
      });
    return response;
  };

  const handleSubmit = async (values, actions) => {
    actions.setSubmitting(true);
    const response = await postProduct(values, uploadProductImage);
    switch (response.status) {
      case 201:
        toast({
          title: 'Post Product Successfull',
          description: response.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        resetFormData(formData);
        setUploadProductImage([]);
        return actions.resetForm();
      default:
        return toast({
          title: 'Something Wrong!',
          description: response.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        isSubmitting,
        isValid,
        dirty,
        values,
        setFieldValue,
        handleSubmit,
        actions,
      }) => (
        <Form autoComplete="off">
          <Modal isOpen={open} onClose={toggleOff} size="6xl">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add Product</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack gap={3}>
                  <Field name="productName">
                    {({ field }) => (
                      <FormControl id="productName" isRequired mb="10px">
                        <FormLabel>Product Name</FormLabel>
                        <Input
                          {...field}
                          placeholder="Product Name"
                          type="text"
                          focusBorderColor="teal.100"
                        />
                        <ErrorMessage
                          name="productName"
                          component={Text}
                          color="red.500"
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="productType">
                    {({ field }) => (
                      <FormControl id="productType" mb="10px" isRequired>
                        <FormLabel>Product Type</FormLabel>
                        <Select
                          placeholder="Select Product Type"
                          name="productType"
                          {...field}
                        >
                          {(() => {
                            switch (user.mitraType) {
                              case 'Pengelola':
                                return pengelolaProductType.map((type) => (
                                  <option key={type} value={type} id={type}>
                                    {type}
                                  </option>
                                ));
                              default:
                                return pengumpulProductType.map((type) => (
                                  <option key={type} value={type} id={type}>
                                    {type}
                                  </option>
                                ));
                            }
                          })()}
                        </Select>
                        <ErrorMessage
                          name="productType"
                          component={Text}
                          color="red.500"
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="descriptionProduct">
                    {({ field }) => (
                      <FormControl id="descriptionProduct" mb="10px" isRequired>
                        <FormLabel>Product Description</FormLabel>
                        <Textarea
                          {...field}
                          placeholder="Enter your product description..."
                          focusBorderColor="teal.100"
                        />
                        <ErrorMessage
                          name="descriptionProduct"
                          component={Text}
                          color="red.500"
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="productPrice">
                    {({ field }) => (
                      <FormControl id="productPrice" mb="10px" isRequired>
                        <FormLabel> Product Price</FormLabel>
                        <InputGroup>
                          <InputLeftElement
                            pointerEvents="none"
                            color="black.300"
                            fontSize="1.2em"
                            children="Rp."
                          />
                          <Input
                            {...field}
                            type="number"
                            placeholder="Enter amount"
                          />
                        </InputGroup>
                        <ErrorMessage
                          name="productPrice"
                          component={Text}
                          color="red.500"
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="productQuantity">
                    {({ field }) => (
                      <FormControl id="productQuantity" mb="10px" isRequired>
                        <FormLabel>Product Quantity</FormLabel>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Kilogram / pcs"
                          focusBorderColor="teal.100"
                        />
                        <ErrorMessage
                          name="productQuantity"
                          component={Text}
                          color="red.500"
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="productImage" type="file" multiple>
                    {({ field: { value, ...field } }) => (
                      <FormControl id="productImage" isRequired>
                        <FormLabel ml="10px">Product Images</FormLabel>
                        <Flex alignItems="center">
                          <input
                            type="file"
                            style={{ display: 'none' }}
                            id="productImage"
                            multiple
                            {...field}
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files) {
                                if (uploadProductImage.length === 0) {
                                  setUploadProductImage([...files]);
                                } else {
                                  setUploadProductImage((prevData) => [
                                    ...prevData,
                                    ...files,
                                  ]);
                                }
                                const imageArray = Array.from(files).map(
                                  (file) => URL.createObjectURL(file)
                                );
                                const updatedValue = value
                                  ? [...value, ...imageArray]
                                  : [...imageArray];
                                setFieldValue('productImage', updatedValue);
                              }
                            }}
                            disabled={value ? value.length === 5 : false}
                          />
                          {values.productImage?.map((image, index) => (
                            <Box key={index} m="10px">
                              <Flex>
                                <Image
                                  src={image}
                                  alt={`attached_product_image_${index}`}
                                  boxSize="150px"
                                  objectFit="cover"
                                />
                                <IconButton
                                  size="xs"
                                  icon={<SmallCloseIcon />}
                                  onClick={() => {
                                    const updatedImages =
                                      values.productImage.filter(
                                        (_, i) => i !== index
                                      );
                                    setUploadProductImage((prevData) =>
                                      prevData.filter((_, i) => i !== index)
                                    );
                                    setFieldValue(
                                      'productImage',
                                      updatedImages
                                    );
                                  }}
                                />
                              </Flex>
                            </Box>
                          ))}
                          <label htmlFor="productImage">
                            <IconButton
                              as="span"
                              icon={<AttachmentIcon color="white" />}
                              aria-label="Attach"
                              isDisabled={value ? value.length === 5 : false}
                              size="lg"
                              bgColor="teal"
                            />
                          </label>
                        </Flex>
                        <FormErrorMessage>
                          Product Images is Need at Least 1 Image
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="red" mr={3} onClick={toggleOff}>
                  Close
                </Button>
                <Button
                  colorScheme="teal"
                  isLoading={isSubmitting}
                  isDisabled={isSubmitting || !isValid || !dirty}
                  onClick={() => handleSubmit(values, actions)}
                >
                  Submit
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Form>
      )}
    </Formik>
  );
}