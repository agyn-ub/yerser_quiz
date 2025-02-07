CREATE TABLE "clubs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"icon" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "clubs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "quiz_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"club_id" integer NOT NULL,
	"question" text NOT NULL,
	"correct_answer" text NOT NULL,
	"options" text[] NOT NULL,
	"difficulty" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_scores" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"club_id" integer,
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
	"selected_club_id" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_telegram_id_unique" UNIQUE("telegram_id")
);
--> statement-breakpoint
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_scores" ADD CONSTRAINT "user_scores_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_scores" ADD CONSTRAINT "user_scores_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_selected_club_id_clubs_id_fk" FOREIGN KEY ("selected_club_id") REFERENCES "public"."clubs"("id") ON DELETE no action ON UPDATE no action;