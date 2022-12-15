import {
    Button,
    Container,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Text,
    Textarea,
    useToast,
} from "@chakra-ui/react";
import {type ChangeEvent, useState} from "react";
import {useAuth} from "../context/AuthContext";
import {sendContactForm} from "../components/api";


const initialTouched = {message: false, email: false, subject: false};


export default function Contact() {
    const {currentUser} = useAuth();

    const initValues = {email: currentUser?.email || "", subject: "", message: ""};

    const initState = {isLoading: false, error: "", values: initValues};


    const toast = useToast();
    const [state, setState] = useState(initState);
    const [touched, setTouched] = useState(initialTouched);

    const {values, isLoading, error} = state;

    const onBlur = ({target}: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) =>
        setTouched((prev) => ({...prev, [target.name]: true}));

    const handleChange = ({target}: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) =>
        setState((prev) => ({
            ...prev,
            values: {
                ...prev.values,
                [target.name]: target.value,
            },
        }));

    const onSubmit = async () => {
        setState((prev) => ({
            ...prev,
            isLoading: true,
        }));
        try {
            await sendContactForm(values);
            setTouched(initialTouched);
            setState(initState);
            toast({
                title: "Message sent.",
                status: "success",
                duration: 2000,
                position: "top",
            });
        } catch (error) {
            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: (error as any).message,
            }));
        }
    };

    return (
        <Container maxW="450px" display={'flex'} justifyContent={'center'} alignItems={'center'}
                   flexDirection={'column'}>
            <Heading>Contact Us</Heading>
            {error && (
                <Text color="red.300" my={4} fontSize="xl">
                    {error}
                </Text>
            )}


            <FormControl isRequired isInvalid={touched.email && !values.email} mb={5}>
                <FormLabel>Email</FormLabel>
                <Input
                    type="email"
                    name="email"
                    errorBorderColor="red.300"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={onBlur}
                />
                <FormErrorMessage>Required</FormErrorMessage>
            </FormControl>

            <FormControl
                mb={5}
                isRequired
                isInvalid={touched.subject && !values.subject}
            >
                <FormLabel>Subject</FormLabel>
                <Input
                    type="text"
                    name="subject"
                    errorBorderColor="red.300"
                    value={values.subject}
                    onChange={handleChange}
                    onBlur={onBlur}
                />
                <FormErrorMessage>Required</FormErrorMessage>
            </FormControl>

            <FormControl
                isRequired
                isInvalid={touched.message && !values.message}
                mb={5}
            >
                <FormLabel>Message</FormLabel>
                <Textarea
                    name="message"
                    rows={4}
                    errorBorderColor="red.300"
                    value={values.message}
                    onChange={handleChange}
                    onBlur={onBlur}
                />
                <FormErrorMessage>Required</FormErrorMessage>
            </FormControl>

            <Button
                variant="outline"
                colorScheme="blue"
                isLoading={isLoading}
                disabled={
                    !values.email || !values.subject || !values.message
                }
                onClick={onSubmit}
            >
                Submit
            </Button>
        </Container>
    );
}