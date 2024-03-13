use Cold_Storage;
go

create table BA (
	BACode		nvarchar(50)	not null primary key,
	BAName		nvarchar(50)	null,
	Address		nvarchar(max)	null,
	Tel			nvarchar(50)	null,
	TaxCode		nvarchar(50)	null,
	IsActived	bit				null
);

create table Plant (
	PlantCode	nvarchar(50)	not null primary key,
	BACode		nvarchar(50)	null,
	PlantName	nvarchar(50)	null,
	CCA			nvarchar(50)	null,
	Address		nvarchar(max)	null,
	ContactName nvarchar(50)	null,
	Tel			nvarchar(50)	null,
	Email		nvarchar(50)	null,
	Remark		nvarchar(max)	null,
	IsActived	bit				null
);

create table [dbo].[Storage] (
	StorageID		int				not null identity(1,1) primary key,
	BACode			nvarchar(50)	null,
	PlantCode		nvarchar(50)	null,
	StorageName		nvarchar(100)	null,
	Remark			nvarchar(max)	null,
	IsActived		bit				null,
	EffectiveDate	datetime		null
);

create table [dbo].[Location] (
	LocationID		int				not null identity(1,1) primary key,
	BACode			nvarchar(50)	null,
	PlantCode		nvarchar(50)	null,
	StorageID		int				null,
	LocationName	nvarchar(50)	null,
	Remark			nvarchar(max)	null,
	IsActived		bit				null,
	EffectiveDate	datetime		null
);

create table [dbo].[Transaction] (
	ID				int				not null identity(1,1) primary key,
	BACode			nvarchar(50)	null,
	PlantCode		nvarchar(50)	null,
	StorageID		int				null,
	LocationID		nvarchar(50)	null,
	DeviceCode		nvarchar(50)	null,
	Temperature		decimal(18,2)	null,
	Humidity		decimal(18,2)	null,
	[Time]			datetime		null,
	SoundAlert		bit				null,
	LightAlert		bit				null,
	EmailAlert		bit				null,
	MesengerAlert	bit				null,
);

create table StandardCondition (
	ID				int				not null identity(1,1) primary key,
	BACode			nvarchar(50)	null,
	PlantCode		nvarchar(50)	null,
	StorageID		int				null,
	LocationID		nvarchar(50)	null,
	TempMin			decimal(18,2)	null,
	TempMax			decimal(18,2)	null,
	HumMin			decimal(18,2)	null,
	HumMax			decimal(18,2)	null,
);

create table DeviceInfo (
	DeviceID 		int 			not null identity(1,1) primary key,
	DeviceCode 		nvarchar(50) 	NULL,
	DeviceName 		nvarchar(50) 	NULL,
	Remark 			nvarchar(200) 	NULL
);

create table dbo.[User] (
	UserID 			int 			not null identity(1,1) primary key,
	RoleID 			int 			NOT NULL,
	UserName 		nvarchar(100) 	NULL,
	PasswordHash 	varchar(MAX) 	NULL,
	Address 		nvarchar(200) 	NULL,
	PhoneNumber 	varchar(15) 	NULL,
	Email 			varchar(100) 	NULL,
	AvatarImgUrl 	varchar(MAX) 	NULL,
	CreatedDate 	datetime 		NULL,
	LastUpdatedDate datetime 		NULL,
	IsDeleted 		bit 			NULL
);

create table dbo.[Role] (
	RoleID 			int 			not null identity(1,1) primary key,
	RoleName 		varchar(100) 	NULL,
	Description 	nvarchar(MAX) 	NULL,
	IsDeleted 		bit 			NULL
);