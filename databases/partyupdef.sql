CREATE TABLE users (
  id int(11) NOT NULL AUTO_INCREMENT,
  steam_id bigint(20) UNSIGNED DEFAULT NULL,
  email varchar(255) NOT NULL UNIQUE,
  username varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  gender varchar(50) NOT NULL,
  birth_date date NOT NULL,
  avatar_url varchar(255) DEFAULT NULL,
  bio text DEFAULT NULL,
  play_style enum('competitive', 'chill', 'both') DEFAULT NULL,
  country_code char(2) DEFAULT 'ES',
  language varchar(50) DEFAULT 'en',
  created_at timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY steam_id (steam_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE games (
  steam_appid int(11) NOT NULL,
  name varchar(255) NOT NULL,
  release_date date DEFAULT NULL,
  cover_url varchar(255) DEFAULT NULL,
  is_multiplayer tinyint(1) DEFAULT 0,
  is_coop tinyint(1) DEFAULT 0,
  PRIMARY KEY (steam_appid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE genres (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tags (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE game_genres (
  steam_appid int(11) NOT NULL,
  genre_id int(11) NOT NULL,
  PRIMARY KEY (steam_appid, genre_id),
  FOREIGN KEY (steam_appid) REFERENCES games(steam_appid) ON DELETE CASCADE,
  FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE game_tags (
  steam_appid int(11) NOT NULL,
  tag_id int(11) NOT NULL,
  PRIMARY KEY (steam_appid, tag_id),
  FOREIGN KEY (steam_appid) REFERENCES games(steam_appid) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_games (
  user_id int(11) NOT NULL,
  steam_appid int(11) NOT NULL,
  playtime_forever int(11) DEFAULT 0,
  playtime_2weeks int(11) DEFAULT 0,
  is_active tinyint(1) DEFAULT 1,
  PRIMARY KEY (user_id, steam_appid),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (steam_appid) REFERENCES games(steam_appid) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE swipes (
  id int(11) NOT NULL AUTO_INCREMENT,
  user_from int(11) NOT NULL,
  user_to int(11) NOT NULL,
  type enum('like', 'dislike') NOT NULL,
  created_at timestamp DEFAULT current_timestamp(),
  PRIMARY KEY (id),
  UNIQUE KEY unique_swipe (user_from, user_to),
  FOREIGN KEY (user_from) REFERENCES users(id),
  FOREIGN KEY (user_to) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE friends (
  user_id int(11) NOT NULL,
  friend_id int(11) NOT NULL,
  status enum('pending', 'accepted', 'blocked') DEFAULT 'pending',
  created_at timestamp DEFAULT current_timestamp(),
  PRIMARY KEY (user_id, friend_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (friend_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;