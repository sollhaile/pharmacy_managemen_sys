--
-- PostgreSQL database dump
--

\restrict umsgKjqh4bvhNRqbKJGXytildIvN8QyhdjqxiByfpLvNJcFezCK7SfkoMDibHAY

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

ALTER TABLE IF EXISTS ONLY public.sale_items DROP CONSTRAINT IF EXISTS sale_items_sale_id_fkey;
ALTER TABLE IF EXISTS ONLY public.sale_items DROP CONSTRAINT IF EXISTS sale_items_batch_id_fkey;
ALTER TABLE IF EXISTS ONLY public.batches DROP CONSTRAINT IF EXISTS batches_supplier_id_fkey;
ALTER TABLE IF EXISTS ONLY public.batches DROP CONSTRAINT IF EXISTS batches_medicine_id_fkey;
DROP INDEX IF EXISTS public.idx_users_username;
DROP INDEX IF EXISTS public.idx_users_role;
ALTER TABLE IF EXISTS ONLY public.wastage DROP CONSTRAINT IF EXISTS wastage_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key9;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key8;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key7;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key63;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key62;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key61;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key60;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key6;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key59;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key58;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key57;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key56;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key55;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key54;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key53;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key52;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key51;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key50;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key5;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key49;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key48;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key47;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key46;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key45;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key44;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key43;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key42;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key41;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key40;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key4;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key39;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key38;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key37;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key36;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key35;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key34;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key33;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key32;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key31;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key30;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key3;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key29;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key28;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key27;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key26;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key25;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key24;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key23;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key22;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key21;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key20;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key2;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key19;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key18;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key17;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key16;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key15;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key14;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key13;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key12;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key11;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key10;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key1;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_pkey;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key9;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key8;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key7;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key62;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key61;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key60;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key6;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key59;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key58;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key57;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key56;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key55;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key54;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key53;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key52;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key51;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key50;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key5;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key49;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key48;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key47;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key46;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key45;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key44;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key43;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key42;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key41;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key40;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key4;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key39;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key38;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key37;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key36;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key35;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key34;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key33;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key32;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key31;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key30;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key3;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key29;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key28;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key27;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key26;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key25;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key24;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key23;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key22;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key21;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key20;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key2;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key19;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key18;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key17;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key16;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key15;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key14;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key13;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key12;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key11;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key10;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key1;
ALTER TABLE IF EXISTS ONLY public.suppliers DROP CONSTRAINT IF EXISTS suppliers_name_key;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_pkey;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key9;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key8;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key7;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key6;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key5;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key4;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key39;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key38;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key37;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key36;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key35;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key34;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key33;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key32;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key31;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key30;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key3;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key29;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key28;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key27;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key26;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key25;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key24;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key23;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key22;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key21;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key20;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key2;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key19;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key18;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key17;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key16;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key15;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key14;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key13;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key12;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key11;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key10;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key1;
ALTER TABLE IF EXISTS ONLY public.sales DROP CONSTRAINT IF EXISTS sales_invoice_number_key;
ALTER TABLE IF EXISTS ONLY public.sale_items DROP CONSTRAINT IF EXISTS sale_items_pkey;
ALTER TABLE IF EXISTS ONLY public.returns DROP CONSTRAINT IF EXISTS returns_pkey;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_pkey;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key9;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key8;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key7;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key62;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key61;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key60;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key6;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key59;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key58;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key57;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key56;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key55;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key54;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key53;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key52;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key51;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key50;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key5;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key49;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key48;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key47;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key46;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key45;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key44;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key43;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key42;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key41;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key40;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key4;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key39;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key38;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key37;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key36;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key35;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key34;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key33;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key32;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key31;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key30;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key3;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key29;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key28;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key27;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key26;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key25;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key24;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key23;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key22;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key21;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key20;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key2;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key19;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key18;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key17;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key16;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key15;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key14;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key13;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key12;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key11;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key10;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key1;
ALTER TABLE IF EXISTS ONLY public.medicines DROP CONSTRAINT IF EXISTS medicines_barcode_key;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_pkey;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key9;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key8;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key7;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key6;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key5;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key4;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key39;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key38;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key37;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key36;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key35;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key34;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key33;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key32;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key31;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key30;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key3;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key29;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key28;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key27;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key26;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key25;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key24;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key23;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key22;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key21;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key20;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key2;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key19;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key18;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key17;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key16;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key15;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key14;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key13;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key12;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key11;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key10;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key1;
ALTER TABLE IF EXISTS ONLY public.customers DROP CONSTRAINT IF EXISTS customers_phone_key;
ALTER TABLE IF EXISTS ONLY public.batches DROP CONSTRAINT IF EXISTS batches_pkey;
ALTER TABLE IF EXISTS ONLY public."SequelizeMeta" DROP CONSTRAINT IF EXISTS "SequelizeMeta_pkey";
ALTER TABLE IF EXISTS public.wastage ALTER COLUMN wastage_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.users ALTER COLUMN user_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.suppliers ALTER COLUMN supplier_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.sales ALTER COLUMN sale_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.sale_items ALTER COLUMN sale_item_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.returns ALTER COLUMN return_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.medicines ALTER COLUMN medicine_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.customers ALTER COLUMN customer_id DROP DEFAULT;
ALTER TABLE IF EXISTS public.batches ALTER COLUMN batch_id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.wastage_wastage_id_seq;
DROP TABLE IF EXISTS public.wastage;
DROP SEQUENCE IF EXISTS public.users_user_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.suppliers_supplier_id_seq;
DROP TABLE IF EXISTS public.suppliers;
DROP SEQUENCE IF EXISTS public.sales_sale_id_seq;
DROP TABLE IF EXISTS public.sales;
DROP SEQUENCE IF EXISTS public.sale_items_sale_item_id_seq;
DROP TABLE IF EXISTS public.sale_items;
DROP SEQUENCE IF EXISTS public.returns_return_id_seq;
DROP TABLE IF EXISTS public.returns;
DROP SEQUENCE IF EXISTS public.medicines_medicine_id_seq;
DROP TABLE IF EXISTS public.medicines;
DROP SEQUENCE IF EXISTS public.customers_customer_id_seq;
DROP TABLE IF EXISTS public.customers;
DROP SEQUENCE IF EXISTS public.batches_batch_id_seq;
DROP TABLE IF EXISTS public.batches;
DROP TABLE IF EXISTS public."SequelizeMeta";
DROP TYPE IF EXISTS public.enum_wastage_reason;
DROP TYPE IF EXISTS public.enum_users_role;
DROP TYPE IF EXISTS public.enum_sales_payment_status;
DROP TYPE IF EXISTS public.enum_sales_payment_method;
DROP TYPE IF EXISTS public.enum_returns_status;
DROP TYPE IF EXISTS public.enum_returns_return_type;
DROP TYPE IF EXISTS public.enum_returns_reason;
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

\unrestrict umsgKjqh4bvhNRqbKJGXytildIvN8QyhdjqxiByfpLvNJcFezCK7SfkoMDibHAY

