--
-- PostgreSQL database dump
--

-- Dumped from database version 11.5
-- Dumped by pg_dump version 11.5

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

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: installations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.installations (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    github_id integer NOT NULL,
    deleted boolean DEFAULT false NOT NULL
);


ALTER TABLE public.installations OWNER TO postgres;

--
-- Name: installations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.installations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.installations_id_seq OWNER TO postgres;

--
-- Name: installations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.installations_id_seq OWNED BY public.installations.id;


--
-- Name: knex_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knex_migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);


ALTER TABLE public.knex_migrations OWNER TO postgres;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knex_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knex_migrations_id_seq OWNER TO postgres;

--
-- Name: knex_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knex_migrations_id_seq OWNED BY public.knex_migrations.id;


--
-- Name: knex_migrations_lock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.knex_migrations_lock (
    index integer NOT NULL,
    is_locked integer
);


ALTER TABLE public.knex_migrations_lock OWNER TO postgres;

--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.knex_migrations_lock_index_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.knex_migrations_lock_index_seq OWNER TO postgres;

--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.knex_migrations_lock_index_seq OWNED BY public.knex_migrations_lock.index;


--
-- Name: organizations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organizations (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    github_id integer NOT NULL,
    name character varying(255),
    login character varying(255) NOT NULL
);


ALTER TABLE public.organizations OWNER TO postgres;

--
-- Name: organizations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.organizations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.organizations_id_seq OWNER TO postgres;

--
-- Name: organizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.organizations_id_seq OWNED BY public.organizations.id;


--
-- Name: repositories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.repositories (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    github_id integer NOT NULL,
    name character varying(255) NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    token character varying(255) NOT NULL,
    organization_id bigint,
    user_id bigint,
    private boolean NOT NULL
);


ALTER TABLE public.repositories OWNER TO postgres;

--
-- Name: repositories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.repositories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.repositories_id_seq OWNER TO postgres;

--
-- Name: repositories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.repositories_id_seq OWNED BY public.repositories.id;


--
-- Name: synchronizations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.synchronizations (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    installation_id bigint NOT NULL,
    job_status character varying(255) NOT NULL,
    type character varying(255) NOT NULL
);


ALTER TABLE public.synchronizations OWNER TO postgres;

--
-- Name: synchronizations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.synchronizations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.synchronizations_id_seq OWNER TO postgres;

--
-- Name: synchronizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.synchronizations_id_seq OWNED BY public.synchronizations.id;


--
-- Name: user_organization_rights; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_organization_rights (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id bigint,
    organization_id bigint
);


ALTER TABLE public.user_organization_rights OWNER TO postgres;

--
-- Name: user_organization_rights_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_organization_rights_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_organization_rights_id_seq OWNER TO postgres;

--
-- Name: user_organization_rights_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_organization_rights_id_seq OWNED BY public.user_organization_rights.id;


--
-- Name: user_repository_rights; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_repository_rights (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_id bigint,
    repository_id bigint
);


ALTER TABLE public.user_repository_rights OWNER TO postgres;

--
-- Name: user_repository_rights_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_repository_rights_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_repository_rights_id_seq OWNER TO postgres;

--
-- Name: user_repository_rights_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_repository_rights_id_seq OWNED BY public.user_repository_rights.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    github_id integer NOT NULL,
    access_token character varying(255),
    email character varying(255),
    login character varying(255) NOT NULL,
    name character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: installations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installations ALTER COLUMN id SET DEFAULT nextval('public.installations_id_seq'::regclass);


--
-- Name: knex_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations ALTER COLUMN id SET DEFAULT nextval('public.knex_migrations_id_seq'::regclass);


--
-- Name: knex_migrations_lock index; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations_lock ALTER COLUMN index SET DEFAULT nextval('public.knex_migrations_lock_index_seq'::regclass);


--
-- Name: organizations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations ALTER COLUMN id SET DEFAULT nextval('public.organizations_id_seq'::regclass);


--
-- Name: repositories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.repositories ALTER COLUMN id SET DEFAULT nextval('public.repositories_id_seq'::regclass);


--
-- Name: synchronizations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.synchronizations ALTER COLUMN id SET DEFAULT nextval('public.synchronizations_id_seq'::regclass);


--
-- Name: user_organization_rights id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_organization_rights ALTER COLUMN id SET DEFAULT nextval('public.user_organization_rights_id_seq'::regclass);


--
-- Name: user_repository_rights id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_repository_rights ALTER COLUMN id SET DEFAULT nextval('public.user_repository_rights_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: installations installations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.installations
    ADD CONSTRAINT installations_pkey PRIMARY KEY (id);


--
-- Name: knex_migrations_lock knex_migrations_lock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations_lock
    ADD CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index);


--
-- Name: knex_migrations knex_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: repositories repositories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.repositories
    ADD CONSTRAINT repositories_pkey PRIMARY KEY (id);


--
-- Name: synchronizations synchronizations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.synchronizations
    ADD CONSTRAINT synchronizations_pkey PRIMARY KEY (id);


--
-- Name: user_organization_rights user_organization_rights_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_organization_rights
    ADD CONSTRAINT user_organization_rights_pkey PRIMARY KEY (id);


--
-- Name: user_repository_rights user_repository_rights_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_repository_rights
    ADD CONSTRAINT user_repository_rights_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: installations_github_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX installations_github_id_index ON public.installations USING btree (github_id);


--
-- Name: organizations_github_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX organizations_github_id_index ON public.organizations USING btree (github_id);


--
-- Name: organizations_login_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX organizations_login_index ON public.organizations USING btree (login);


--
-- Name: repositories_enabled_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX repositories_enabled_index ON public.repositories USING btree (enabled);


--
-- Name: repositories_github_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX repositories_github_id_index ON public.repositories USING btree (github_id);


--
-- Name: repositories_organization_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX repositories_organization_id_index ON public.repositories USING btree (organization_id);


--
-- Name: repositories_private_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX repositories_private_index ON public.repositories USING btree (private);


--
-- Name: repositories_user_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX repositories_user_id_index ON public.repositories USING btree (user_id);


--
-- Name: synchronizations_installation_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX synchronizations_installation_id_index ON public.synchronizations USING btree (installation_id);


--
-- Name: synchronizations_job_status_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX synchronizations_job_status_index ON public.synchronizations USING btree (job_status);


--
-- Name: synchronizations_type_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX synchronizations_type_index ON public.synchronizations USING btree (type);


--
-- Name: user_organization_rights_organization_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_organization_rights_organization_id_index ON public.user_organization_rights USING btree (organization_id);


--
-- Name: user_organization_rights_user_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_organization_rights_user_id_index ON public.user_organization_rights USING btree (user_id);


--
-- Name: user_repository_rights_repository_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_repository_rights_repository_id_index ON public.user_repository_rights USING btree (repository_id);


--
-- Name: user_repository_rights_user_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_repository_rights_user_id_index ON public.user_repository_rights USING btree (user_id);


--
-- Name: users_access_token_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_access_token_index ON public.users USING btree (access_token);


--
-- Name: users_email_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_email_index ON public.users USING btree (email);


--
-- Name: users_github_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_github_id_index ON public.users USING btree (github_id);


--
-- Name: users_login_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_login_index ON public.users USING btree (login);


--
-- Name: repositories repositories_organization_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.repositories
    ADD CONSTRAINT repositories_organization_id_foreign FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: repositories repositories_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.repositories
    ADD CONSTRAINT repositories_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: synchronizations synchronizations_installation_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.synchronizations
    ADD CONSTRAINT synchronizations_installation_id_foreign FOREIGN KEY (installation_id) REFERENCES public.installations(id);


--
-- Name: user_organization_rights user_organization_rights_organization_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_organization_rights
    ADD CONSTRAINT user_organization_rights_organization_id_foreign FOREIGN KEY (organization_id) REFERENCES public.organizations(id);


--
-- Name: user_organization_rights user_organization_rights_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_organization_rights
    ADD CONSTRAINT user_organization_rights_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_repository_rights user_repository_rights_repository_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_repository_rights
    ADD CONSTRAINT user_repository_rights_repository_id_foreign FOREIGN KEY (repository_id) REFERENCES public.repositories(id);


--
-- Name: user_repository_rights user_repository_rights_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_repository_rights
    ADD CONSTRAINT user_repository_rights_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

-- Knex migrations

INSERT INTO knex_migrations(name, batch, migration_time) VALUES ('20190831180010_init.js', 1, NOW());