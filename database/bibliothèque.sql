--
-- PostgreSQL database dump
--

\restrict dXY0VtumqFBhluJqdbzxHFTRhzeyfp6HgLfGRwJbBDWpqqe3gqqd6lebFAPUZdK

-- Dumped from database version 16.6
-- Dumped by pg_dump version 18.4

-- Started on 2026-09-16 10:57:44

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 856 (class 1247 OID 32791)
-- Name: status_livre; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.status_livre AS ENUM (
    'disponible',
    'emprunte'
);


ALTER TYPE public.status_livre OWNER TO root;

--
-- TOC entry 847 (class 1247 OID 32770)
-- Name: status_livres; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.status_livres AS ENUM (
    'disponible',
    'emprunte'
);


ALTER TYPE public.status_livres OWNER TO root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 32783)
-- Name: adherents; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.adherents (
    id integer NOT NULL,
    nom character varying(150) NOT NULL,
    contact character varying(100) NOT NULL,
    date_inscription date DEFAULT CURRENT_DATE
);


ALTER TABLE public.adherents OWNER TO root;

--
-- TOC entry 217 (class 1259 OID 32782)
-- Name: adherents_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.adherents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.adherents_id_seq OWNER TO root;

--
-- TOC entry 4885 (class 0 OID 0)
-- Dependencies: 217
-- Name: adherents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.adherents_id_seq OWNED BY public.adherents.id;


--
-- TOC entry 216 (class 1259 OID 32776)
-- Name: auteurs; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.auteurs (
    id integer NOT NULL,
    nom character varying(150) NOT NULL,
    nationalite character varying(100)
);


ALTER TABLE public.auteurs OWNER TO root;

--
-- TOC entry 215 (class 1259 OID 32775)
-- Name: auteurs_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.auteurs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auteurs_id_seq OWNER TO root;

--
-- TOC entry 4886 (class 0 OID 0)
-- Dependencies: 215
-- Name: auteurs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.auteurs_id_seq OWNED BY public.auteurs.id;


--
-- TOC entry 222 (class 1259 OID 32810)
-- Name: emprunts; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.emprunts (
    id integer NOT NULL,
    date_emprunt date DEFAULT CURRENT_DATE,
    date_retour_prevue date NOT NULL,
    date_retour_effective date,
    livre_id integer NOT NULL,
    adherent_id integer NOT NULL
);


ALTER TABLE public.emprunts OWNER TO root;

--
-- TOC entry 221 (class 1259 OID 32809)
-- Name: emprunts_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.emprunts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.emprunts_id_seq OWNER TO root;

--
-- TOC entry 4887 (class 0 OID 0)
-- Dependencies: 221
-- Name: emprunts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.emprunts_id_seq OWNED BY public.emprunts.id;


--
-- TOC entry 220 (class 1259 OID 32796)
-- Name: livres; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.livres (
    id integer NOT NULL,
    titre character varying(150) NOT NULL,
    annee_publication integer,
    statut public.status_livre DEFAULT 'disponible'::public.status_livre,
    auteur_id integer NOT NULL,
    CONSTRAINT livres_annee_publication_check CHECK ((annee_publication > 0))
);


ALTER TABLE public.livres OWNER TO root;

--
-- TOC entry 219 (class 1259 OID 32795)
-- Name: livres_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.livres_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.livres_id_seq OWNER TO root;

--
-- TOC entry 4888 (class 0 OID 0)
-- Dependencies: 219
-- Name: livres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.livres_id_seq OWNED BY public.livres.id;


--
-- TOC entry 4710 (class 2604 OID 32786)
-- Name: adherents id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.adherents ALTER COLUMN id SET DEFAULT nextval('public.adherents_id_seq'::regclass);


--
-- TOC entry 4709 (class 2604 OID 32779)
-- Name: auteurs id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.auteurs ALTER COLUMN id SET DEFAULT nextval('public.auteurs_id_seq'::regclass);


--
-- TOC entry 4714 (class 2604 OID 32813)
-- Name: emprunts id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.emprunts ALTER COLUMN id SET DEFAULT nextval('public.emprunts_id_seq'::regclass);


--
-- TOC entry 4712 (class 2604 OID 32799)
-- Name: livres id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.livres ALTER COLUMN id SET DEFAULT nextval('public.livres_id_seq'::regclass);


--
-- TOC entry 4875 (class 0 OID 32783)
-- Dependencies: 218
-- Data for Name: adherents; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.adherents (id, nom, contact, date_inscription) FROM stdin;
1	Exaucé MOUANGA	+242066804011	2026-09-11
2	Grace MBEMBA	+242066567064	2026-09-11
3	Destinée MABOUMBA	+242068520561	2026-09-11
4	Grace Monster	+242066567064	2026-09-13
\.


--
-- TOC entry 4873 (class 0 OID 32776)
-- Dependencies: 216
-- Data for Name: auteurs; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.auteurs (id, nom, nationalite) FROM stdin;
2	Voltaire	Française
3	Alain MABANCKOU	Congolaise
4	Chinua ACHEBE	Nigériane
5	Dorcasse MOUSSANA	Congolaise
6	MABIALA	Congolaise
7	MABIALA	Congolaise
\.


--
-- TOC entry 4879 (class 0 OID 32810)
-- Dependencies: 222
-- Data for Name: emprunts; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.emprunts (id, date_emprunt, date_retour_prevue, date_retour_effective, livre_id, adherent_id) FROM stdin;
3	2026-08-12	2026-08-26	2026-08-24	3	1
2	2026-08-25	2026-09-08	2026-09-14	2	2
4	2026-09-14	20026-09-25	2026-09-14	2	4
7	2026-09-14	2026-09-25	\N	5	1
\.


--
-- TOC entry 4877 (class 0 OID 32796)
-- Dependencies: 220
-- Data for Name: livres; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.livres (id, titre, annee_publication, statut, auteur_id) FROM stdin;
3	Verre cassé	2006	disponible	3
6	Adolescence	2022	disponible	5
2	Candide	1759	disponible	2
5	Mémoires de porc-epic	2006	emprunte	3
\.


--
-- TOC entry 4889 (class 0 OID 0)
-- Dependencies: 217
-- Name: adherents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.adherents_id_seq', 4, true);


--
-- TOC entry 4890 (class 0 OID 0)
-- Dependencies: 215
-- Name: auteurs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.auteurs_id_seq', 7, true);


--
-- TOC entry 4891 (class 0 OID 0)
-- Dependencies: 221
-- Name: emprunts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.emprunts_id_seq', 7, true);


--
-- TOC entry 4892 (class 0 OID 0)
-- Dependencies: 219
-- Name: livres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.livres_id_seq', 6, true);


--
-- TOC entry 4720 (class 2606 OID 32789)
-- Name: adherents adherents_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.adherents
    ADD CONSTRAINT adherents_pkey PRIMARY KEY (id);


--
-- TOC entry 4718 (class 2606 OID 32781)
-- Name: auteurs auteurs_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.auteurs
    ADD CONSTRAINT auteurs_pkey PRIMARY KEY (id);


--
-- TOC entry 4724 (class 2606 OID 32816)
-- Name: emprunts emprunts_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.emprunts
    ADD CONSTRAINT emprunts_pkey PRIMARY KEY (id);


--
-- TOC entry 4722 (class 2606 OID 32803)
-- Name: livres livres_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.livres
    ADD CONSTRAINT livres_pkey PRIMARY KEY (id);


--
-- TOC entry 4725 (class 1259 OID 49153)
-- Name: unique_emprunt_actif; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX unique_emprunt_actif ON public.emprunts USING btree (adherent_id, livre_id) WHERE (date_retour_effective IS NULL);


--
-- TOC entry 4727 (class 2606 OID 32822)
-- Name: emprunts fk_emprunt_adherent; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.emprunts
    ADD CONSTRAINT fk_emprunt_adherent FOREIGN KEY (adherent_id) REFERENCES public.adherents(id) ON DELETE CASCADE;


--
-- TOC entry 4728 (class 2606 OID 32817)
-- Name: emprunts fk_emprunt_livre; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.emprunts
    ADD CONSTRAINT fk_emprunt_livre FOREIGN KEY (livre_id) REFERENCES public.livres(id) ON DELETE CASCADE;


--
-- TOC entry 4726 (class 2606 OID 32804)
-- Name: livres fk_livre_auteur; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.livres
    ADD CONSTRAINT fk_livre_auteur FOREIGN KEY (auteur_id) REFERENCES public.auteurs(id) ON DELETE CASCADE;


-- Completed on 2026-09-16 10:57:47

--
-- PostgreSQL database dump complete
--

\unrestrict dXY0VtumqFBhluJqdbzxHFTRhzeyfp6HgLfGRwJbBDWpqqe3gqqd6lebFAPUZdK

