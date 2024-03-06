/* Replace with your SQL commands */

CREATE TABLE `cards` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `userId` bigint DEFAULT NULL,
  `fingerprint` varchar(255) NOT NULL,
  `key` varchar(255) NOT NULL,
  `brand` varchar(255) NOT NULL,
  `first6` varchar(255) NOT NULL,
  `last4` varchar(255) NOT NULL,
  `expMonth` varchar(255) NOT NULL,
  `expYear` varchar(255) NOT NULL,
  `cvv` varchar(255) NOT NULL,
  `maskedPan` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `isDeleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fingerprint` (`fingerprint`),
  UNIQUE KEY `key` (`key`)
) ;


CREATE TABLE `ledger` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reference` varchar(255) NOT NULL,
  `account` varchar(255) NOT NULL,
  `credit` decimal(10,0) NOT NULL DEFAULT '0',
  `debit` decimal(10,0) NOT NULL DEFAULT '0',
  `narration` varchar(255) DEFAULT NULL,
  `reversed` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `transactions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `reference` varchar(255) NOT NULL,
  `account` varchar(255) NOT NULL,
  `amount` decimal(10,0) NOT NULL,
  `type` enum('ACCOUNT_FUNDING','BILL_PAYMENT','TRANSFER','CARD_PAYMENT','GENERAL') NOT NULL DEFAULT 'GENERAL',
  `narration` varchar(255) DEFAULT NULL,
  `acquirerReference` varchar(255) NOT NULL,
  `status` enum('SUCCESS','PENDING','FAILED','REVERSED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `phoneNumber` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `isDeleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ;

CREATE TABLE `wallets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `userId` bigint DEFAULT NULL,
  `accountNumber` varchar(255) NOT NULL,
  `virtualAccountNumber` varchar(255) NOT NULL,
  `virtualAccountBankCode` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `isDeleted` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `accountNumber` (`accountNumber`)
) ;