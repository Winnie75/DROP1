import Head from "next/head";
import styles from '../styles/Home.module.css'
import {useState} from "react";
import NextLink from "next/link";
import {useAuth} from "../context/AuthContext";
import {useRouter} from "next/navigation";
import {ProtectedRoute} from "../components/ProtectedRoute/ProtectedRoute";
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Link,
    Button,
    Heading,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();

    const {login} = useAuth();

    const handleLogin = async (e: any) => {
        e.preventDefault();

        try {
            await login(email, password);
            router.push('/');
        } catch (e) {
            console.log(e);
            setError('Failed to login, please try again or contact support');
        }


    };

    return (
        <ProtectedRoute type={'onlyGuest'}>
            <div className={styles.container}>
                <Head>
                    <title>Qr id | Login</title>
                    <meta name="description" content="Generated by create next app"/>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>

                <main className={styles.main}>

                    <Flex
                        align={'center'}
                        justify={'center'}
                        bg={useColorModeValue('gray.50', 'gray.800')}>
                        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                            <Stack align={'center'}>
                                <Heading fontSize={{sm: 'xl', md: '4xl'}}>Sign in to your account</Heading>
                                <Text fontSize={{sm: 'sm',md: 'lg'}} color={'gray.600'}>
                                    to manage your reshrd items ✌️
                                </Text>
                            </Stack>
                            <Box
                                rounded={'lg'}
                                bg={useColorModeValue('white', 'gray.700')}
                                boxShadow={'lg'}
                                p={8}>
                                <Stack spacing={4} width={{sm: '300px', md: '400px'}}>
                                    <FormControl id="email">
                                        <FormLabel>Email address</FormLabel>
                                        <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                                    </FormControl>
                                    <FormControl id="password">
                                        <FormLabel>Password</FormLabel>
                                        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                                    </FormControl>

                                    <Stack spacing={10} pt={2}>
                                        <Button
                                            bg={'blue.400'}
                                            color={'white'}
                                            _hover={{
                                                bg: 'blue.500',
                                            }}
                                        onClick={handleLogin}>
                                            Sign in
                                        </Button>

                                        <Stack pt={6}>
                                            <Text align={'center'}>
                                                Don&lsquo;t have an account? <Link as={NextLink} href={'/register'} color={'blue.400'}>Sign up</Link>
                                            </Text>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Stack>
                    </Flex>

                </main>

            </div>
        </ProtectedRoute>
    );
}