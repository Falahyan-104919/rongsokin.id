import { useParams } from 'react-router-dom';
import axiosInstance from '../../../utils/axios';
import { useQuery } from '@tanstack/react-query';
import {
  Button,
  ButtonGroup,
  Tbody,
  Td,
  Text,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { focusManager } from '@tanstack/react-query';

export default function TableBodyTransaction({ transactions, keyword }) {
  const toast = useToast();
  const ActionButton = ({
    status,
    transactionId,
    productId,
    order_quantity,
    quantity_product,
  }) => {
    switch (status) {
      case 'pending':
        return (
          <ButtonGroup>
            <Button
              colorScheme="blue"
              isDisabled={order_quantity > quantity_product}
              onClick={async () => {
                focusManager.setFocused(false);
                await axiosInstance
                  .put(`mitra/process_order/${transactionId}`, {
                    status: 'process',
                    quantity: quantity_product - order_quantity,
                    productId: productId,
                  })
                  .then((res) => {
                    focusManager.setFocused(true);
                    if (res.status == 201) {
                      return toast({
                        title: 'Status Order Updated',
                        description: res.data.message,
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                      });
                    }
                  })
                  .then((err) => {
                    return toast({
                      title: 'Status Order Failed to Update',
                      status: 'error',
                      duration: 3000,
                      isClosable: true,
                    });
                  });
              }}
            >
              Process
            </Button>
            <Button
              colorScheme="red"
              onClick={async () => {
                focusManager.setFocused(false);
                await axiosInstance
                  .put(`mitra/update_status_transaction/${id}`, {
                    status: 'cancel',
                  })
                  .then((res) => {
                    focusManager.setFocused(true);
                    if (res.status == 201) {
                      return toast({
                        title: 'Status Order Updated',
                        description: res.data.message,
                        status: 'success',
                        duration: 3000,
                        isClosable: true,
                      });
                    }
                  })
                  .then((err) => {
                    return toast({
                      title: 'Status Order Failed to Update',
                      description: err.response.data.message,
                      status: 'error',
                      duration: 3000,
                      isClosable: true,
                    });
                  });
              }}
            >
              Cancel
            </Button>
          </ButtonGroup>
        );
      case 'process':
        return (
          <Button colorScheme="green" isDisabled>
            Success
          </Button>
        );
      case 'delivered':
        return <Button colorScheme="green">Success</Button>;
      default:
        return <Text>No Action Needed</Text>;
    }
  };

  const filteredTransactions = transactions?.filter((transaction) => {
    return transaction.name.toLowerCase().includes(keyword.toLowerCase());
  });

  if (filteredTransactions?.length == 0) {
    return (
      <Tbody>
        <Tr>
          <Td colSpan="5" textAlign="center">
            <Text>No Order Found</Text>
          </Td>
        </Tr>
      </Tbody>
    );
  }
  return (
    <Tbody>
      {filteredTransactions?.map((transaction, index) => (
        <Tr key={index}>
          <Td>{transaction.fullname}</Td>
          <Td>{transaction.name}</Td>
          <Td>{transaction.quantity}</Td>
          <Td>RP. {transaction.total_price}</Td>
          <Td>{transaction.transaction_status.toUpperCase()}</Td>
          <Td colSpan={2} textAlign="center">
            <ActionButton
              status={transaction.transaction_status}
              transactionId={transaction.transaction_id}
              productId={transaction.product_id}
              order_quantity={transaction.quantity}
              quantity_product={transaction.quantity_product}
            />
          </Td>
        </Tr>
      ))}
    </Tbody>
  );
}
