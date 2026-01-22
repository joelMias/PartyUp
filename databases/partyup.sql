-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3307
-- Tiempo de generación: 22-01-2026 a las 09:37:21
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `partyup`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `genere`
--

CREATE TABLE `genere` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `joc`
--

CREATE TABLE `joc` (
  `steam_appID` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `data_release` date NOT NULL,
  `caratula` varchar(255) NOT NULL,
  `multiplayer` tinyint(1) NOT NULL,
  `cooperatiu` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `joc_genere`
--

CREATE TABLE `joc_genere` (
  `steam_appID` int(11) NOT NULL,
  `id_genere` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tag`
--

CREATE TABLE `tag` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tag_genere`
--

CREATE TABLE `tag_genere` (
  `steam_appID` int(11) NOT NULL,
  `id_tag` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `steam_id` bigint(20) UNSIGNED DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `birth_date` date NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `steam_id`, `email`, `username`, `password`, `gender`, `birth_date`, `avatar_url`, `created_at`) VALUES
(1, NULL, 'joelmiasfernandez06@gmail.com', 'Joel Mias', '$2y$10$wdd..PZKQVZDT8MvHPIvCu6wTFu5gVc7a6LNYH53tIbDDbQM4jl76', 'Male', '2026-01-02', NULL, '2026-01-21 16:26:44'),
(2, NULL, 'asdf@g.com', 'asdf', '$2y$10$VAIY7Ul6pRzkEOIlNksgv.DTcHQbVVVPdZ2kDIAKH.gVo0RYu7ufu', 'Male', '2026-01-15', NULL, '2026-01-21 17:01:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuari_joc`
--

CREATE TABLE `usuari_joc` (
  `user_id` int(11) NOT NULL,
  `steam_appID` int(11) NOT NULL,
  `hores_totals` int(11) NOT NULL DEFAULT 0,
  `ultimas_2semanas` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `genere`
--
ALTER TABLE `genere`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `joc`
--
ALTER TABLE `joc`
  ADD PRIMARY KEY (`steam_appID`);

--
-- Indices de la tabla `joc_genere`
--
ALTER TABLE `joc_genere`
  ADD PRIMARY KEY (`steam_appID`,`id_genere`),
  ADD KEY `id_genere` (`id_genere`);

--
-- Indices de la tabla `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `tag_genere`
--
ALTER TABLE `tag_genere`
  ADD PRIMARY KEY (`steam_appID`,`id_tag`),
  ADD KEY `id_tag` (`id_tag`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `steam_id` (`steam_id`);

--
-- Indices de la tabla `usuari_joc`
--
ALTER TABLE `usuari_joc`
  ADD PRIMARY KEY (`user_id`,`steam_appID`),
  ADD KEY `steam_appID` (`steam_appID`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `genere`
--
ALTER TABLE `genere`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tag`
--
ALTER TABLE `tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `joc_genere`
--
ALTER TABLE `joc_genere`
  ADD CONSTRAINT `joc_genere_ibfk_1` FOREIGN KEY (`steam_appID`) REFERENCES `joc` (`steam_appID`),
  ADD CONSTRAINT `joc_genere_ibfk_2` FOREIGN KEY (`id_genere`) REFERENCES `genere` (`id`);

--
-- Filtros para la tabla `tag_genere`
--
ALTER TABLE `tag_genere`
  ADD CONSTRAINT `tag_genere_ibfk_1` FOREIGN KEY (`steam_appID`) REFERENCES `joc` (`steam_appID`),
  ADD CONSTRAINT `tag_genere_ibfk_2` FOREIGN KEY (`id_tag`) REFERENCES `tag` (`id`);

--
-- Filtros para la tabla `usuari_joc`
--
ALTER TABLE `usuari_joc`
  ADD CONSTRAINT `usuari_joc_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `usuari_joc_ibfk_2` FOREIGN KEY (`steam_appID`) REFERENCES `joc` (`steam_appID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
