--
-- PostgreSQL database dump
--

\restrict hISCGoTG7rjPrTYG8Y8eK5e3EpAEIqhvaw2xQDcOhOD9Cv2qtv3usuVepFiBfAc

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_returns_reason; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_returns_reason AS ENUM (
    'EXPIRED',
    'DAMAGED',
    'WRONG_ITEM',
    'CUSTOMER_RETURN',
    'QUALITY_ISSUE',
    'OTHER'
);


--
-- Name: enum_returns_return_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_returns_return_type AS ENUM (
    'CUSTOMER',
    'SUPPLIER'
);


--
-- Name: enum_returns_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_returns_status AS ENUM (
    'PENDING',
    'APPROVED',
    'COMPLETED',
    'REJECTED'
);


--
-- Name: enum_sales_payment_method; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_sales_payment_method AS ENUM (
    'cash',
    'transfer',
    'card',
    'insurance'
);


--
-- Name: enum_sales_payment_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_sales_payment_status AS ENUM (
    'paid',
    'pending',
    'cancelled'
);


--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_users_role AS ENUM (
    'admin',
    'pharmacist',
    'manager',
    'cashier',
    'store_keeper'
);


--
-- Name: enum_wastage_reason; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_wastage_reason AS ENUM (
    'EXPIRED',
    'DAMAGED',
    'SPILLED',
    'BROKEN',
    'THEFT',
    'OTHER'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


--
-- Name: batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.batches (
    batch_id integer NOT NULL,
    batch_number character varying(100) NOT NULL,
    medicine_id integer NOT NULL,
    expiry_date date NOT NULL,
    manufacturing_date date,
    supplier_id integer,
    quantity integer DEFAULT 0 NOT NULL,
    cost_price numeric(10,2),
    selling_price numeric(10,2),
    is_active boolean DEFAULT true,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: batches_batch_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.batches_batch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: batches_batch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.batches_batch_id_seq OWNED BY public.batches.batch_id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customers (
    customer_id integer NOT NULL,
    phone character varying(20) NOT NULL,
    name character varying(255) NOT NULL,
    total_visits integer DEFAULT 0,
    last_visit timestamp with time zone,
    created_at timestamp with time zone
);


--
-- Name: customers_customer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customers_customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customers_customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customers_customer_id_seq OWNED BY public.customers.customer_id;


--
-- Name: medicines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medicines (
    medicine_id integer NOT NULL,
    name character varying(255) NOT NULL,
    generic_name character varying(255),
    brand character varying(100),
    category character varying(100),
    form character varying(50),
    strength character varying(100),
    unit character varying(50),
    barcode character varying(50),
    reorder_level integer DEFAULT 10,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: medicines_medicine_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.medicines_medicine_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: medicines_medicine_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.medicines_medicine_id_seq OWNED BY public.medicines.medicine_id;


--
-- Name: returns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.returns (
    return_id integer NOT NULL,
    return_type public.enum_returns_return_type NOT NULL,
    reference_id character varying(50) NOT NULL,
    batch_id integer NOT NULL,
    medicine_id integer NOT NULL,
    medicine_name character varying(255) NOT NULL,
    batch_number character varying(100) NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    total_amount numeric(10,2) NOT NULL,
    reason public.enum_returns_reason NOT NULL,
    status public.enum_returns_status DEFAULT 'PENDING'::public.enum_returns_status,
    notes text,
    created_by integer NOT NULL,
    approved_by integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: returns_return_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.returns_return_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: returns_return_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.returns_return_id_seq OWNED BY public.returns.return_id;


--
-- Name: sale_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sale_items (
    sale_item_id integer NOT NULL,
    sale_id integer NOT NULL,
    batch_id integer NOT NULL,
    medicine_id integer NOT NULL,
    medicine_name character varying(255) NOT NULL,
    batch_number character varying(100) NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    total_price numeric(10,2) NOT NULL
);


--
-- Name: sale_items_sale_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sale_items_sale_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sale_items_sale_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sale_items_sale_item_id_seq OWNED BY public.sale_items.sale_item_id;


--
-- Name: sales; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales (
    sale_id integer NOT NULL,
    invoice_number character varying(50),
    customer_id integer NOT NULL,
    customer_name character varying(255) NOT NULL,
    customer_phone character varying(20) NOT NULL,
    prescription_id character varying(100) NOT NULL,
    doctor_name character varying(100),
    items_total numeric(10,2) NOT NULL,
    discount numeric(10,2) DEFAULT 0,
    tax numeric(10,2) DEFAULT 0,
    total_amount numeric(10,2) NOT NULL,
    payment_method public.enum_sales_payment_method NOT NULL,
    payment_status public.enum_sales_payment_status DEFAULT 'paid'::public.enum_sales_payment_status,
    sale_date timestamp with time zone,
    sold_by integer NOT NULL,
    notes text
);


--
-- Name: sales_sale_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sales_sale_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sales_sale_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sales_sale_id_seq OWNED BY public.sales.sale_id;


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.suppliers (
    supplier_id integer NOT NULL,
    name character varying(255) NOT NULL,
    contact_person character varying(100),
    email character varying(100),
    phone character varying(20),
    address text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone
);


--
-- Name: suppliers_supplier_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.suppliers_supplier_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: suppliers_supplier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.suppliers_supplier_id_seq OWNED BY public.suppliers.supplier_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    full_name character varying(255) NOT NULL,
    role public.enum_users_role DEFAULT 'pharmacist'::public.enum_users_role,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone,
    password_hash character varying(255) NOT NULL
);


--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: wastage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wastage (
    wastage_id integer NOT NULL,
    batch_id integer NOT NULL,
    medicine_id integer NOT NULL,
    medicine_name character varying(255) NOT NULL,
    batch_number character varying(100) NOT NULL,
    quantity integer NOT NULL,
    cost_price numeric(10,2) NOT NULL,
    total_loss numeric(10,2) NOT NULL,
    reason public.enum_wastage_reason NOT NULL,
    notes text,
    reported_by integer NOT NULL,
    reported_date timestamp with time zone
);


--
-- Name: wastage_wastage_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.wastage_wastage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: wastage_wastage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.wastage_wastage_id_seq OWNED BY public.wastage.wastage_id;


--
-- Name: batches batch_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batches ALTER COLUMN batch_id SET DEFAULT nextval('public.batches_batch_id_seq'::regclass);


--
-- Name: customers customer_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers ALTER COLUMN customer_id SET DEFAULT nextval('public.customers_customer_id_seq'::regclass);


--
-- Name: medicines medicine_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines ALTER COLUMN medicine_id SET DEFAULT nextval('public.medicines_medicine_id_seq'::regclass);


--
-- Name: returns return_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns ALTER COLUMN return_id SET DEFAULT nextval('public.returns_return_id_seq'::regclass);


--
-- Name: sale_items sale_item_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_items ALTER COLUMN sale_item_id SET DEFAULT nextval('public.sale_items_sale_item_id_seq'::regclass);


--
-- Name: sales sale_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales ALTER COLUMN sale_id SET DEFAULT nextval('public.sales_sale_id_seq'::regclass);


--
-- Name: suppliers supplier_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN supplier_id SET DEFAULT nextval('public.suppliers_supplier_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Name: wastage wastage_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wastage ALTER COLUMN wastage_id SET DEFAULT nextval('public.wastage_wastage_id_seq'::regclass);


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."SequelizeMeta" (name) FROM stdin;
20260208174517-create-users-table.js
20260208174829-create-suppliers-table.js
20260208174929-create-batches-table.js
20260208174946-create-customers-table.js
20260208175028-create-sales-table.js
20260208175100-create-inventory-transactions-table.js
20260208175148-create-expiry-alerts-table.js
\.


--
-- Data for Name: batches; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.batches (batch_id, batch_number, medicine_id, expiry_date, manufacturing_date, supplier_id, quantity, cost_price, selling_price, is_active, created_at, updated_at) FROM stdin;
3	PARA-2026-001	3	2027-09-30	2026-01-20	2	200	1.20	2.50	t	2026-02-12 12:35:04.332+03	2026-02-12 12:35:04.333+03
2	IBU-2026-002	2	2028-06-30	2026-02-01	1	149	2.60	5.20	t	2026-02-12 12:35:04.279+03	2026-02-12 13:58:50.313+03
5	BATCH-CRT-001	3	2026-03-01	2025-08-01	1	45	2.50	5.00	t	2026-02-12 15:36:10.320764+03	\N
7	BATCH-OK-001	3	2027-12-31	2026-01-15	1	200	2.20	4.50	t	2026-02-12 15:36:10.349115+03	\N
4	IBU-2026-003	2	2026-03-15	2025-09-15	1	45	2.40	4.90	t	2026-02-12 12:35:04.361+03	2026-02-12 15:37:45.013+03
8	BATCH-CRT-001	3	2026-03-01	2025-08-01	1	45	2.50	5.00	t	\N	\N
9	BATCH-CRT-002	7	2026-03-05	2025-09-01	1	30	15.00	30.00	t	\N	\N
10	BATCH-CRT-003	11	2026-03-10	2025-10-01	2	20	3.00	6.00	t	\N	\N
11	BATCH-WRN-001	2	2026-04-15	2025-11-01	1	100	2.50	5.00	t	\N	\N
12	BATCH-WRN-002	20	2026-05-01	2025-12-01	2	80	8.00	16.00	t	\N	\N
13	BATCH-OK-001	3	2027-12-31	2026-01-15	1	200	2.20	4.50	t	\N	\N
14	BATCH-OK-002	8	2028-06-30	2026-02-01	2	150	12.00	25.00	t	\N	\N
16	BATCH-LOW-CRT-001	6	2027-08-31	2026-02-10	2	5	25.00	50.00	t	\N	\N
18	BATCH-OOS-001	16	2027-07-31	2026-01-30	1	0	45.00	90.00	t	\N	\N
19	AML-2025-001	14	2026-04-30	2025-10-01	2	50	3.00	6.00	t	\N	\N
20	AML-2026-001	14	2027-05-31	2026-02-01	2	80	3.20	6.50	t	\N	\N
1	IBU-2026-001	2	2027-12-31	2026-01-15	1	100	2.50	5.00	t	2026-02-12 12:35:04.208+03	2026-02-12 16:39:29.481+03
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customers (customer_id, phone, name, total_visits, last_visit, created_at) FROM stdin;
3	+251911223344	Abebe Kebede	5	2026-02-10 15:42:45.462361+03	2026-02-12 13:58:50.192+03
\.


--
-- Data for Name: medicines; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.medicines (medicine_id, name, generic_name, brand, category, form, strength, unit, barcode, reorder_level, is_active, created_at, updated_at) FROM stdin;
2	Ibuprofen 400mg	Ibuprofen	Advil Extra	Analgesic	Tablet	400mg	mg	\N	20	t	2026-02-12 12:06:18.822+03	2026-02-12 12:07:38.585+03
1	Test Medicine	\N	\N	\N	\N	\N	\N	\N	10	f	2026-02-12 12:05:05.155+03	2026-02-12 12:07:38.678+03
3	Paracetamol 500mg	Acetaminophen	Tylenol	Analgesic	Tablet	500mg	mg	\N	50	t	2026-02-12 12:35:04.307+03	2026-02-12 12:35:04.307+03
4	Paracetamol 500mg	Acetaminophen	Tylenol	Analgesic	Tablet	500mg	mg	1234567890123	50	t	\N	\N
5	Ibuprofen 400mg	Ibuprofen	Advil	Analgesic	Tablet	400mg	mg	1234567890124	30	t	\N	\N
6	Tramadol 50mg	Tramadol	Tramal	Analgesic	Capsule	50mg	mg	1234567890125	20	t	\N	\N
7	Amoxicillin 500mg	Amoxicillin	Amoxil	Antibiotic	Capsule	500mg	mg	1234567890126	40	t	\N	\N
8	Azithromycin 250mg	Azithromycin	Zithromax	Antibiotic	Tablet	250mg	mg	1234567890127	25	t	\N	\N
9	Ciprofloxacin 500mg	Ciprofloxacin	Cipro	Antibiotic	Tablet	500mg	mg	1234567890128	30	t	\N	\N
10	Doxycycline 100mg	Doxycycline	Vibramycin	Antibiotic	Capsule	100mg	mg	1234567890129	20	t	\N	\N
11	Metformin 500mg	Metformin HCl	Glucophage	Anti-diabetic	Tablet	500mg	mg	1234567890130	60	t	\N	\N
12	Glibenclamide 5mg	Glibenclamide	Daonil	Anti-diabetic	Tablet	5mg	mg	1234567890131	40	t	\N	\N
13	Insulin Regular	Human Insulin	Humulin R	Anti-diabetic	Injection	100IU	ml	1234567890132	15	t	\N	\N
14	Amlodipine 5mg	Amlodipine	Norvasc	Cardiovascular	Tablet	5mg	mg	1234567890133	45	t	\N	\N
15	Lisinopril 10mg	Lisinopril	Zestril	Cardiovascular	Tablet	10mg	mg	1234567890134	40	t	\N	\N
16	Atorvastatin 20mg	Atorvastatin	Lipitor	Cardiovascular	Tablet	20mg	mg	1234567890135	35	t	\N	\N
17	Salbutamol Inhaler	Albuterol	Ventolin	Respiratory	Inhaler	100mcg	dose	1234567890136	10	t	\N	\N
18	Ambroxol Syrup	Ambroxol	Mucolite	Respiratory	Syrup	30mg/5ml	ml	1234567890137	25	t	\N	\N
19	Cetirizine 10mg	Cetirizine	Zyrtec	Respiratory	Tablet	10mg	mg	1234567890138	30	t	\N	\N
20	Omeprazole 20mg	Omeprazole	Losec	Gastrointestinal	Capsule	20mg	mg	1234567890139	35	t	\N	\N
21	Ranitidine 150mg	Ranitidine	Zantac	Gastrointestinal	Tablet	150mg	mg	1234567890140	30	t	\N	\N
22	Vitamin C 500mg	Ascorbic Acid	Cevit	Vitamins	Tablet	500mg	mg	1234567890141	50	t	\N	\N
23	Vitamin D3 1000IU	Cholecalciferol	D-Forte	Vitamins	Capsule	1000IU	IU	1234567890142	40	t	\N	\N
24	Multivitamin	Multivitamin	Mega-V	Vitamins	Tablet	1tab	tab	1234567890143	60	t	\N	\N
\.


--
-- Data for Name: returns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.returns (return_id, return_type, reference_id, batch_id, medicine_id, medicine_name, batch_number, quantity, unit_price, total_amount, reason, status, notes, created_by, approved_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: sale_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sale_items (sale_item_id, sale_id, batch_id, medicine_id, medicine_name, batch_number, quantity, unit_price, total_price) FROM stdin;
1	1	1	2	Ibuprofen 400mg	IBU-2026-001	2	5.00	10.00
2	1	2	2	Ibuprofen 400mg	IBU-2026-002	1	5.20	5.20
3	2	1	2	Ibuprofen 400mg	IBU-2026-001	1	5.00	5.00
4	3	1	2	Ibuprofen 400mg	IBU-2026-001	1	5.00	5.00
5	4	1	2	Ibuprofen 400mg	IBU-2026-001	1	5.00	5.00
7	7	1	2	Ibuprofen 400mg	IBU-2026-001	10	5.00	50.00
8	7	4	2	Ibuprofen 400mg	IBU-2026-003	5	4.90	24.50
\.


--
-- Data for Name: sales; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sales (sale_id, invoice_number, customer_id, customer_name, customer_phone, prescription_id, doctor_name, items_total, discount, tax, total_amount, payment_method, payment_status, sale_date, sold_by, notes) FROM stdin;
1	INV-93930315	3	Abebe Kebede	+251911223344	RX-2026-001	Dr. Tadesse	15.20	5.00	2.50	12.70	cash	paid	2026-02-12 13:58:50.315+03	1	\N
2	INV-98145059	3	Abebe Kebede	+251911223344	RX-2026-001	\N	5.00	0.00	0.00	5.00	cash	paid	2026-02-12 15:09:05.059+03	1	\N
3	INV-98977383	3	Abebe Kebede	+251911223344	RX-2026-001	\N	5.00	0.00	0.00	5.00	cash	paid	2026-02-12 15:22:57.383+03	1	\N
4	INV-99242433	3	Abebe Kebede	+251911223344	RX-2026-001	\N	5.00	0.00	0.00	5.00	cash	paid	2026-02-12 15:27:22.433+03	1	\N
7	INV-99865016	3	Abebe Kebede	+251911223344	RX-2026-003	Dr. Tadesse	74.50	5.00	2.50	72.00	cash	paid	2026-02-12 15:37:45.016+03	1	\N
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.suppliers (supplier_id, name, contact_person, email, phone, address, is_active, created_at) FROM stdin;
1	MediPharm Distributors	John Doe	john@medipharm.com	+1234567890	123 Pharma Street	t	2026-02-12 12:29:52.758+03
2	Global Healthcare Ltd	Jane Smith	jane@globalhealth.com	+1234567891	456 Medical Center, Delhi	t	2026-02-12 12:34:40.313+03
5	PharmaEthiopia	Abebe Kebede	abebe@pharmaeth.com	+251933333333	Addis Ababa, Kazanchis	t	\N
6	Addis Pharma	Tigist Haile	tigist@addispharma.com	+251944444444	Addis Ababa, Merkato	t	\N
7	East Africa Medical	Samuel Tesfaye	samuel@eastafrica.com	+251955555555	Adama, Main Road	t	\N
13	ABC Pharmaceuticals	John Smith	john@abcpharma.com	+251911123456	Addis Ababa, Ethiopia	t	2026-02-12 16:37:52.692+03
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (user_id, username, full_name, role, is_active, created_at, password_hash) FROM stdin;
1	admin	System Admin	admin	t	\N	$2a$10$N9qo8uLOickgx2ZMRZoMye3.Z9j3gJ1k6Z7yB7fKq7n6nL4L5T6Oq
2	pharmacist1	John Pharmacist	pharmacist	t	\N	$2a$10$N9qo8uLOickgx2ZMRZoMye3.Z9j3gJ1k6Z7yB7fKq7n6nL4L5T6Oq
3	cashier1	Mary Cashier	cashier	t	\N	$2a$10$N9qo8uLOickgx2ZMRZoMye3.Z9j3gJ1k6Z7yB7fKq7n6nL4L5T6Oq
\.


--
-- Data for Name: wastage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.wastage (wastage_id, batch_id, medicine_id, medicine_name, batch_number, quantity, cost_price, total_loss, reason, notes, reported_by, reported_date) FROM stdin;
1	1	2	Ibuprofen 400mg	IBU-2026-001	5	2.50	12.50	DAMAGED	Bottle cracked	1	2026-02-12 16:16:35.453+03
2	1	2	Ibuprofen 400mg	IBU-2026-001	5	2.50	12.50	DAMAGED	Bottle cracked during handling	1	2026-02-12 16:39:29.208+03
3	1	2	Ibuprofen 400mg	IBU-2026-001	5	2.50	12.50	DAMAGED	Bottle cracked	1	2026-02-12 16:39:29.479+03
\.


--
-- Name: batches_batch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.batches_batch_id_seq', 21, true);


--
-- Name: customers_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customers_customer_id_seq', 3, true);


--
-- Name: medicines_medicine_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.medicines_medicine_id_seq', 24, true);


--
-- Name: returns_return_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.returns_return_id_seq', 1, false);


--
-- Name: sale_items_sale_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sale_items_sale_item_id_seq', 8, true);


--
-- Name: sales_sale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sales_sale_id_seq', 7, true);


--
-- Name: suppliers_supplier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.suppliers_supplier_id_seq', 13, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_user_id_seq', 6, true);


--
-- Name: wastage_wastage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.wastage_wastage_id_seq', 3, true);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: batches batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batches
    ADD CONSTRAINT batches_pkey PRIMARY KEY (batch_id);


--
-- Name: customers customers_phone_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key UNIQUE (phone);


--
-- Name: customers customers_phone_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key1 UNIQUE (phone);


--
-- Name: customers customers_phone_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key10 UNIQUE (phone);


--
-- Name: customers customers_phone_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key11 UNIQUE (phone);


--
-- Name: customers customers_phone_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key12 UNIQUE (phone);


--
-- Name: customers customers_phone_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key13 UNIQUE (phone);


--
-- Name: customers customers_phone_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key14 UNIQUE (phone);


--
-- Name: customers customers_phone_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key15 UNIQUE (phone);


--
-- Name: customers customers_phone_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key16 UNIQUE (phone);


--
-- Name: customers customers_phone_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key17 UNIQUE (phone);


--
-- Name: customers customers_phone_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key18 UNIQUE (phone);


--
-- Name: customers customers_phone_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key19 UNIQUE (phone);


--
-- Name: customers customers_phone_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key2 UNIQUE (phone);


--
-- Name: customers customers_phone_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key20 UNIQUE (phone);


--
-- Name: customers customers_phone_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key21 UNIQUE (phone);


--
-- Name: customers customers_phone_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key22 UNIQUE (phone);


--
-- Name: customers customers_phone_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key23 UNIQUE (phone);


--
-- Name: customers customers_phone_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key24 UNIQUE (phone);


--
-- Name: customers customers_phone_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key25 UNIQUE (phone);


--
-- Name: customers customers_phone_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key26 UNIQUE (phone);


--
-- Name: customers customers_phone_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key27 UNIQUE (phone);


--
-- Name: customers customers_phone_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key28 UNIQUE (phone);


--
-- Name: customers customers_phone_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key29 UNIQUE (phone);


--
-- Name: customers customers_phone_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key3 UNIQUE (phone);


--
-- Name: customers customers_phone_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key30 UNIQUE (phone);


--
-- Name: customers customers_phone_key31; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key31 UNIQUE (phone);


--
-- Name: customers customers_phone_key32; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key32 UNIQUE (phone);


--
-- Name: customers customers_phone_key33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key33 UNIQUE (phone);


--
-- Name: customers customers_phone_key34; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key34 UNIQUE (phone);


--
-- Name: customers customers_phone_key35; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key35 UNIQUE (phone);


--
-- Name: customers customers_phone_key36; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key36 UNIQUE (phone);


--
-- Name: customers customers_phone_key37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key37 UNIQUE (phone);


--
-- Name: customers customers_phone_key38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key38 UNIQUE (phone);


--
-- Name: customers customers_phone_key39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key39 UNIQUE (phone);


--
-- Name: customers customers_phone_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key4 UNIQUE (phone);


--
-- Name: customers customers_phone_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key5 UNIQUE (phone);


--
-- Name: customers customers_phone_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key6 UNIQUE (phone);


--
-- Name: customers customers_phone_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key7 UNIQUE (phone);


--
-- Name: customers customers_phone_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key8 UNIQUE (phone);


--
-- Name: customers customers_phone_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_phone_key9 UNIQUE (phone);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (customer_id);


--
-- Name: medicines medicines_barcode_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key1 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key10 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key11 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key12 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key13 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key14 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key15 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key16 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key17 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key18 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key19 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key2 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key20 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key21 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key22 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key23 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key24 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key25 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key26 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key27 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key28 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key29 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key3 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key30 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key31; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key31 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key32; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key32 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key33 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key34; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key34 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key35; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key35 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key36; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key36 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key37 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key38 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key39 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key4 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key40 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key41; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key41 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key42; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key42 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key43; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key43 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key44; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key44 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key45; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key45 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key46; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key46 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key47; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key47 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key48; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key48 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key49; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key49 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key5 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key50; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key50 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key51; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key51 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key52; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key52 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key53; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key53 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key54; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key54 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key55; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key55 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key56; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key56 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key57; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key57 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key58; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key58 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key59 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key6 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key60; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key60 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key61; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key61 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key62; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key62 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key7 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key8 UNIQUE (barcode);


--
-- Name: medicines medicines_barcode_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_barcode_key9 UNIQUE (barcode);


--
-- Name: medicines medicines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_pkey PRIMARY KEY (medicine_id);


--
-- Name: returns returns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_pkey PRIMARY KEY (return_id);


--
-- Name: sale_items sale_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_items
    ADD CONSTRAINT sale_items_pkey PRIMARY KEY (sale_item_id);


--
-- Name: sales sales_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key1 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key10 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key11 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key12 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key13 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key14 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key15 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key16 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key17 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key18 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key19 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key2 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key20 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key21 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key22 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key23 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key24 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key25 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key26 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key27 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key28 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key29 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key3 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key30 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key31; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key31 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key32; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key32 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key33 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key34; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key34 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key35; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key35 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key36; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key36 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key37 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key38 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key39 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key4 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key5 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key6 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key7 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key8 UNIQUE (invoice_number);


--
-- Name: sales sales_invoice_number_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_invoice_number_key9 UNIQUE (invoice_number);


--
-- Name: sales sales_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales
    ADD CONSTRAINT sales_pkey PRIMARY KEY (sale_id);


--
-- Name: suppliers suppliers_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key UNIQUE (name);


--
-- Name: suppliers suppliers_name_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key1 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key10 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key11 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key12 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key13 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key14 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key15 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key16 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key17 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key18 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key19 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key2 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key20 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key21 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key22 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key23 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key24 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key25 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key26 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key27 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key28 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key29 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key3 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key30 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key31; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key31 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key32; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key32 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key33 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key34; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key34 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key35; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key35 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key36; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key36 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key37 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key38 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key39 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key4 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key40 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key41; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key41 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key42; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key42 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key43; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key43 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key44; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key44 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key45; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key45 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key46; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key46 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key47; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key47 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key48; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key48 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key49; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key49 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key5 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key50; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key50 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key51; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key51 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key52; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key52 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key53; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key53 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key54; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key54 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key55; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key55 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key56; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key56 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key57; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key57 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key58; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key58 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key59 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key6 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key60; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key60 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key61; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key61 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key62; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key62 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key7 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key8 UNIQUE (name);


--
-- Name: suppliers suppliers_name_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_name_key9 UNIQUE (name);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (supplier_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: users users_username_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key1 UNIQUE (username);


--
-- Name: users users_username_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key10 UNIQUE (username);


--
-- Name: users users_username_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key11 UNIQUE (username);


--
-- Name: users users_username_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key12 UNIQUE (username);


--
-- Name: users users_username_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key13 UNIQUE (username);


--
-- Name: users users_username_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key14 UNIQUE (username);


--
-- Name: users users_username_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key15 UNIQUE (username);


--
-- Name: users users_username_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key16 UNIQUE (username);


--
-- Name: users users_username_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key17 UNIQUE (username);


--
-- Name: users users_username_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key18 UNIQUE (username);


--
-- Name: users users_username_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key19 UNIQUE (username);


--
-- Name: users users_username_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key2 UNIQUE (username);


--
-- Name: users users_username_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key20 UNIQUE (username);


--
-- Name: users users_username_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key21 UNIQUE (username);


--
-- Name: users users_username_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key22 UNIQUE (username);


--
-- Name: users users_username_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key23 UNIQUE (username);


--
-- Name: users users_username_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key24 UNIQUE (username);


--
-- Name: users users_username_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key25 UNIQUE (username);


--
-- Name: users users_username_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key26 UNIQUE (username);


--
-- Name: users users_username_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key27 UNIQUE (username);


--
-- Name: users users_username_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key28 UNIQUE (username);


--
-- Name: users users_username_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key29 UNIQUE (username);


--
-- Name: users users_username_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key3 UNIQUE (username);


--
-- Name: users users_username_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key30 UNIQUE (username);


--
-- Name: users users_username_key31; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key31 UNIQUE (username);


--
-- Name: users users_username_key32; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key32 UNIQUE (username);


--
-- Name: users users_username_key33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key33 UNIQUE (username);


--
-- Name: users users_username_key34; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key34 UNIQUE (username);


--
-- Name: users users_username_key35; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key35 UNIQUE (username);


--
-- Name: users users_username_key36; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key36 UNIQUE (username);


--
-- Name: users users_username_key37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key37 UNIQUE (username);


--
-- Name: users users_username_key38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key38 UNIQUE (username);


--
-- Name: users users_username_key39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key39 UNIQUE (username);


--
-- Name: users users_username_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key4 UNIQUE (username);


--
-- Name: users users_username_key40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key40 UNIQUE (username);


--
-- Name: users users_username_key41; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key41 UNIQUE (username);


--
-- Name: users users_username_key42; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key42 UNIQUE (username);


--
-- Name: users users_username_key43; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key43 UNIQUE (username);


--
-- Name: users users_username_key44; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key44 UNIQUE (username);


--
-- Name: users users_username_key45; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key45 UNIQUE (username);


--
-- Name: users users_username_key46; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key46 UNIQUE (username);


--
-- Name: users users_username_key47; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key47 UNIQUE (username);


--
-- Name: users users_username_key48; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key48 UNIQUE (username);


--
-- Name: users users_username_key49; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key49 UNIQUE (username);


--
-- Name: users users_username_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key5 UNIQUE (username);


--
-- Name: users users_username_key50; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key50 UNIQUE (username);


--
-- Name: users users_username_key51; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key51 UNIQUE (username);


--
-- Name: users users_username_key52; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key52 UNIQUE (username);


--
-- Name: users users_username_key53; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key53 UNIQUE (username);


--
-- Name: users users_username_key54; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key54 UNIQUE (username);


--
-- Name: users users_username_key55; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key55 UNIQUE (username);


--
-- Name: users users_username_key56; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key56 UNIQUE (username);


--
-- Name: users users_username_key57; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key57 UNIQUE (username);


--
-- Name: users users_username_key58; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key58 UNIQUE (username);


--
-- Name: users users_username_key59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key59 UNIQUE (username);


--
-- Name: users users_username_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key6 UNIQUE (username);


--
-- Name: users users_username_key60; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key60 UNIQUE (username);


--
-- Name: users users_username_key61; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key61 UNIQUE (username);


--
-- Name: users users_username_key62; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key62 UNIQUE (username);


--
-- Name: users users_username_key63; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key63 UNIQUE (username);


--
-- Name: users users_username_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key7 UNIQUE (username);


--
-- Name: users users_username_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key8 UNIQUE (username);


--
-- Name: users users_username_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key9 UNIQUE (username);


--
-- Name: wastage wastage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wastage
    ADD CONSTRAINT wastage_pkey PRIMARY KEY (wastage_id);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_username ON public.users USING btree (username);


--
-- Name: batches batches_medicine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batches
    ADD CONSTRAINT batches_medicine_id_fkey FOREIGN KEY (medicine_id) REFERENCES public.medicines(medicine_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: batches batches_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batches
    ADD CONSTRAINT batches_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(supplier_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sale_items sale_items_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_items
    ADD CONSTRAINT sale_items_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.batches(batch_id) ON UPDATE CASCADE;


--
-- Name: sale_items sale_items_sale_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sale_items
    ADD CONSTRAINT sale_items_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sales(sale_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict hISCGoTG7rjPrTYG8Y8eK5e3EpAEIqhvaw2xQDcOhOD9Cv2qtv3usuVepFiBfAc

