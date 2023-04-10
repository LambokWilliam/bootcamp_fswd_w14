import { useEffect, useState } from 'react';
import { Button, Container, Flex, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, Text, useDisclosure, useToast, VStack } from '@chakra-ui/react';
import { loginUser } from '@/modules/fetch';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useGlobalContext } from '@/context/globalContext';

function Layout({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isLogin, setIsLogin } = useGlobalContext();
  const toast = useToast();
  const router = useRouter();

  return (
    <>
      <Flex padding={4} sx={{ position: 'sticky', top: 0, zIndex: 99 }} background='linear-gradient(#ff5f6d, #ffc371)' color='white'>
        <Link href='/'>
          <Text
            as='b'
            fontSize='4xl'
            fontFamily='monospace'
            _hover={{
              opacity: 0.8,
              filter: 'brightness(1.2)',
              cursor: 'pointer',
            }}>
            Library Fusion
          </Text>
        </Link>
        <Spacer />
        <HStack>
          {isLogin && (
            <Link href='/books/create'>
              <Button colorScheme='blackAlpha'>Create New Book</Button>
            </Link>
          )}
          {!isLogin ? (
            <Button onClick={onOpen} colorScheme='blue'>
              Login
            </Button>
          ) : (
            <Button
              colorScheme='blue'
              onClick={() => {
                localStorage.removeItem('token');
                setIsLogin(false);
                router.push('/');
              }}>
              Logout
            </Button>
          )}
        </HStack>

        <Modal isOpen={isOpen} onClose={onClose}>
          <form
            id='login-form'
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const { email, password } = e.target.elements;
                const token = await loginUser({ email: email.value, password: password.value });
                localStorage.setItem('token', token.token);
                setIsLogin(true);
                router.push('/');
                onClose();
              } catch (err) {
                toast({
                  title: 'Error',
                  description: err.message,
                  status: 'error',
                  duration: 3000,
                  isClosable: true,
                });
              }
            }}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Login</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input name='email' type='email' placeholder='Enter your email address' />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input type='password' name='password' placeholder='Enter your password' />
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button type='submit' form='login-form' colorScheme='blue' mr={3}>
                  Login
                </Button>
                <Link href='/register' onClick={onClose}>
                  <Button variant='ghost'>Sign Up</Button>
                </Link>
              </ModalFooter>
            </ModalContent>
          </form>
        </Modal>
      </Flex>
      <Container maxW='container.xl' color='gray.700' mt={4} px={8} py={6} boxShadow='md' rounded='md'>
        {children}
      </Container>
      <Flex as='footer' justifyContent='center' alignItems='center' mt={200} py={4} borderTop='1px solid' borderColor='gray.300' background='linear-gradient(#ff5f6d, #ffc371)'>
        <Text fontSize='sm' textAlign='center' color='white'>
          © {new Date().getFullYear()} Library Fusion. All rights reserved.
        </Text>
      </Flex>
    </>
  );
}

export default Layout;
