import Head from "next/head";
import {useEffect, useState} from "react";
import NextLink from "next/link";
import {useAuth} from "../context/AuthContext";
import {useRouter} from "next/navigation";
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link, FormErrorMessage
} from '@chakra-ui/react';
import {ViewIcon, ViewOffIcon} from '@chakra-ui/icons';
import {GetServerSidePropsContext} from "next";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";

type RegisterFormInputs = {
    email: string;
    password: string;
    confirmPassword: string;
};


const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    confirmPassword: yup.string().oneOf([yup.ref('password')], 'Password are not the same').required()
});

export default function Register({reqEmail}: { reqEmail: string }) {
    const router = useRouter();
    const [error, setError] = useState('');
    const [showingPass, setShowingPass] = useState(false);

    const {register: registerAccount} = useAuth();

    const {currentUser} = useAuth();

    useEffect(() => {
        if (currentUser) {
            router.push('/');
        }

    }, [currentUser, router]);

    const {
        handleSubmit,
        register,
        formState: {errors, isSubmitting},
        setValue
    } = useForm<RegisterFormInputs>({
        resolver: yupResolver(schema)
    })

    useEffect(() => {
        if (reqEmail) {
            setValue('email', reqEmail);
        }
    }, [reqEmail, setValue]);


    const onSubmit = async (data: RegisterFormInputs) => {
        setError('')
        try {
            await registerAccount(data.email, data.password);
            router.push('/');
        } catch (e) {
            console.log(e);
            setError('Failed to create an account, please try again or contact support');
        }
    };

    return (
        <div>
            <Head>
                <title>Register - Updateable QR Clothing Control Panel | RESHRD</title>
            </Head>

            <main>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Flex
                        align={'center'}
                        justify={'center'}>
                        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}
                               bg={useColorModeValue('gray.50', 'gray.800')}>
                            <Stack align={'center'}>
                                <Heading fontSize={{sm: 'xl', md: '4xl'}} textAlign={'center'}>
                                    Sign up
                                </Heading>
                                <Text fontSize={{sm: 'sm', md: 'lg'}} color={'gray.600'}>
                                    to manage your reshrd items ✌️
                                </Text>
                            </Stack>

                            {
                                error && <Text style={{margin: '10px auto 2px'}} color={'red.500'}>{error}</Text>
                            }

                            <Box
                                rounded={'lg'}
                                bg={useColorModeValue('white', 'gray.700')}
                                boxShadow={'lg'}
                                p={8}>
                                <Stack spacing={4} width={{sm: '300px', md: '400px'}}>
                                    <FormControl isInvalid={!!errors.email}>
                                        <FormLabel htmlFor="email">Email</FormLabel>

                                        <Input
                                            id="email"
                                            placeholder="johndoe@email.com"
                                            {...register('email')}
                                        />

                                        <FormErrorMessage>
                                            {errors.email && errors.email.message}
                                        </FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={!!errors.password}>
                                        <FormLabel htmlFor="password">Password</FormLabel>
                                        <InputGroup>
                                            <Input id="password"
                                                   type={showingPass ? 'text' : 'password'} {...register('password')} />

                                            <InputRightElement h={'full'}>
                                                <Button
                                                    variant={'ghost'}
                                                    onClick={() =>
                                                        setShowingPass((showPassword) => !showPassword)
                                                    }>
                                                    {showingPass ? <ViewIcon/> : <ViewOffIcon/>}
                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>

                                        <FormErrorMessage>
                                            {errors.password && errors.password.message}
                                        </FormErrorMessage>
                                    </FormControl>

                                    <FormControl isInvalid={!!errors.confirmPassword}>
                                        <FormLabel htmlFor="confirmPassword">Password</FormLabel>
                                        <InputGroup>
                                            <Input id="confirmPassword"
                                                   type={showingPass ? 'text' : 'password'} {...register('confirmPassword')} />

                                            <InputRightElement h={'full'}>
                                                <Button
                                                    variant={'ghost'}
                                                    onClick={() =>
                                                        setShowingPass((showPassword) => !showPassword)
                                                    }>
                                                    {showingPass ? <ViewIcon/> : <ViewOffIcon/>}
                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>

                                        <FormErrorMessage>
                                            {errors.confirmPassword && errors.confirmPassword.message}
                                        </FormErrorMessage>
                                    </FormControl>

                                    <Stack spacing={10} pt={2}>
                                        <Button
                                            mt={4}
                                            colorScheme="teal"
                                            isLoading={isSubmitting}
                                            type="submit">
                                            Sign up
                                        </Button>
                                    </Stack>

                                    <Stack pt={6}>
                                        <Text align={'center'}>
                                            Already a user? <Link as={NextLink} href={'/login'}
                                                                   color={'blue.400'}>Login</Link>
                                        </Text>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Stack>
                    </Flex>
                </form>
            </main>

        </div>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const email = context.query.email || null

    return {
        props: {
            reqEmail: email
        },
    }
}