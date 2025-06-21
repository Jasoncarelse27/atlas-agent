CREATE TABLE public.webhook_logs (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid,
    prompt text,
    response text
);

ALTER TABLE public.webhook_logs OWNER TO postgres;

CREATE SEQUENCE public.webhook_logs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.webhook_logs_id_seq OWNER TO postgres;

ALTER SEQUENCE public.webhook_logs_id_seq OWNED BY public.webhook_logs.id;

ALTER TABLE ONLY public.webhook_logs ALTER COLUMN id SET DEFAULT nextval('public.webhook_logs_id_seq'::regclass);

ALTER TABLE ONLY public.webhook_logs
    ADD CONSTRAINT webhook_logs_pkey PRIMARY KEY (id); 