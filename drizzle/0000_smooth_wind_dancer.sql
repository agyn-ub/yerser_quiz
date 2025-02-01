CREATE TABLE "quiz_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"correct_answer" text NOT NULL,
	"options" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"score" integer NOT NULL,
	"correct_answers" integer NOT NULL,
	"completed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"telegram_id" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"username" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_telegram_id_unique" UNIQUE("telegram_id")
);
--> statement-breakpoint
ALTER TABLE "user_scores" ADD CONSTRAINT "user_scores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;