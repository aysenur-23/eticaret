-- CreateTable
CREATE TABLE "Cell" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "chemistry" TEXT NOT NULL,
    "nominalV" REAL NOT NULL,
    "capacityAh" REAL NOT NULL,
    "contDischargeA" REAL NOT NULL,
    "peakDischargeA" REAL NOT NULL,
    "maxChargeA" REAL NOT NULL,
    "internalRmOhm" REAL NOT NULL,
    "maxChargeV" REAL NOT NULL,
    "cutOffV" REAL NOT NULL,
    "weight_g" REAL NOT NULL,
    "width_mm" REAL NOT NULL,
    "height_mm" REAL NOT NULL,
    "length_mm" REAL NOT NULL,
    "grade" TEXT,
    "manufacturer" TEXT,
    "dateCode" TEXT,
    "datasheetUrl" TEXT,
    "msdsUrl" TEXT,
    "testReportUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BMS" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "seriesMin" INTEGER NOT NULL,
    "seriesMax" INTEGER NOT NULL,
    "chemistry" TEXT NOT NULL,
    "contA" INTEGER NOT NULL,
    "peakA" INTEGER NOT NULL,
    "ovpV" REAL NOT NULL,
    "uvpV" REAL NOT NULL,
    "ocpA" INTEGER,
    "scpA" INTEGER,
    "balanceType" TEXT NOT NULL,
    "comms" TEXT,
    "ntcCount" INTEGER,
    "pinoutDocUrl" TEXT,
    "wiringGuideUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Charger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "outV" REAL NOT NULL,
    "outA" REAL NOT NULL,
    "profile" TEXT NOT NULL,
    "connector" TEXT NOT NULL,
    "efficiency" REAL,
    "pfc" BOOLEAN,
    "noiseNote" TEXT,
    "protections" TEXT,
    "datasheetUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Accessory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "specs" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "ipRating" TEXT,
    "width_mm" REAL NOT NULL,
    "height_mm" REAL NOT NULL,
    "length_mm" REAL NOT NULL,
    "mountInfo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Connector" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "contA" INTEGER NOT NULL,
    "peakA" INTEGER,
    "antiSpark" BOOLEAN,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Doc" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "scenario" TEXT,
    "targetV" REAL,
    "targetWh" REAL,
    "targetA" REAL,
    "weightMaxKg" REAL,
    "tempMinC" REAL,
    "tempMaxC" REAL,
    "budgetTry" REAL,
    "notes" TEXT,
    "ns" INTEGER,
    "np" INTEGER,
    "cellId" TEXT,
    "bmsId" TEXT,
    "chargerId" TEXT,
    "connectorLoadId" TEXT,
    "connectorChargeId" TEXT,
    "caseId" TEXT,
    "bomJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
