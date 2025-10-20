USE `nodejs_sql`;
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (`id` BIGINT AUTO_INCREMENT NOT NULL, `username` VARCHAR (255)  NOT NULL , `firstname` VARCHAR (255)  NOT NULL , `lastname` VARCHAR (255)  NOT NULL , `email` VARCHAR (255)  NOT NULL UNIQUE, `password` VARCHAR (255)  NOT NULL , `role` VARCHAR (255)  NOT NULL , `refresh_token` VARCHAR (255)   , `created_at` TIMESTAMP  NOT NULL , `updated_at` TIMESTAMP  NOT NULL , PRIMARY KEY (`id`));
