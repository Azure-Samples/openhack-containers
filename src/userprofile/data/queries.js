exports.INSERT_USER_PROFILE =
`INSERT INTO UserProfiles
(
  Id,
  FirstName,
  LastName,
  UserId,
  ProfilePictureUri,
  Rating,
  Ranking,
  TotalDistance,
  TotalTrips,
  TotalTime,
  HardStops,
  HardAccelerations,
  FuelConsumption,
  MaxSpeed,
  CreatedAt,
  UpdatedAt,
  Deleted
)
SELECT
  Id,
  FirstName,
  LastName,
  UserId,
  ProfilePictureUri,
  Rating,
  Ranking,
  TotalDistance,
  TotalTrips,
  TotalTime,
  HardStops,
  HardAccelerations,
  FuelConsumption,
  MaxSpeed,
  GETDATE(),
  GETDATE(),
  Deleted
FROM OPENJSON(@UserProfileJson) WITH 
(
  Id nvarchar(128),
  FirstName nvarchar(max),
  LastName nvarchar(max),
  UserId nvarchar(max),
  ProfilePictureUri nvarchar(max),
  Rating int,
  Ranking int,
  TotalDistance float(53),
  TotalTrips bigint,
  TotalTime bigint,
  HardStops bigint,
  HardAccelerations bigint,
  FuelConsumption float(53),
  MaxSpeed float(53),
  Deleted bit
) AS JSON`;

exports.UPDATE_USER_PROFILE=
`UPDATE UserProfiles
SET 
  FirstName           = updaterecord.FirstName,
  LastName            = updaterecord.LastName,
  UserId              = updaterecord.UserId,
  ProfilePictureUri   = updaterecord.ProfilePictureUri,
  Rating              = updaterecord.Rating,
  Ranking             = updaterecord.Ranking,
  TotalDistance       = updaterecord.TotalDistance,
  TotalTrips          = updaterecord.TotalTrips,
  TotalTime           = updaterecord.TotalTime,
  HardStops           = updaterecord.HardStops,
  HardAccelerations   = updaterecord.HardAccelerations,
  FuelConsumption     = updaterecord.FuelConsumption,
  MaxSpeed            = updaterecord.MaxSpeed,
  UpdatedAt           = updaterecord.UpdatedAt,
  Deleted             = updaterecord.Deleted
FROM 
  ( SELECT
      u.Id,
      COALESCE(payload.FirstName, u.FirstName) AS FirstName,
      COALESCE(payload.LastName, u.LastName) AS LastName,
      COALESCE(payload.UserId, u.UserId) AS UserId,
      COALESCE(payload.ProfilePictureUri, u.ProfilePictureUri) AS ProfilePictureUri,
      COALESCE(payload.Rating, u.Rating) AS Rating,
      COALESCE(payload.Ranking, u.Ranking) AS Ranking,
      COALESCE(payload.TotalDistance, u.TotalDistance) AS TotalDistance,
      COALESCE(payload.TotalTrips, u.TotalTrips) AS TotalTrips,
      COALESCE(payload.TotalTime, u.TotalTime) AS TotalTime,
      COALESCE(payload.HardStops, u.HardStops) AS HardStops,
      COALESCE(payload.HardAccelerations, u.HardAccelerations) AS HardAccelerations,
      COALESCE(payload.FuelConsumption, u.FuelConsumption) AS FuelConsumption,
      COALESCE(payload.MaxSpeed, u.MaxSpeed) AS MaxSpeed, 
      u.CreatedAt,
      GETDATE() AS UpdatedAt,
      COALESCE(payload.Deleted , u.Deleted) AS Deleted
    FROM   
      UserProfiles u
      INNER JOIN OPENJSON(@UserProfileJson) WITH 
      (
        Id nvarchar(128),
        FirstName nvarchar(max),
        LastName nvarchar(max),
        UserId nvarchar(max),
        ProfilePictureUri nvarchar(max),
        Rating int,
        Ranking int,
        TotalDistance float(53),
        TotalTrips bigint,
        TotalTime bigint,
        HardStops bigint,
        HardAccelerations bigint,
        FuelConsumption float(53),
        MaxSpeed float(53),
        Deleted bit
      ) payload ON u.Id = payload.Id
    WHERE 
      u.Id = @user_profile_id 
  ) updaterecord
WHERE
    UserProfiles.Id = updaterecord.Id`;
    
exports.SELECT_USER_PROFILE_BY_ID=
 'select * from UserProfiles WHERE id = @user_profile_id FOR JSON PATH';

exports.SELECT_USER_PROFILES=
 'select * FROM UserProfiles FOR JSON PATH';

exports.DELETE_USER_PROFILE=
 'UPDATE UserProfiles SET Deleted = 1 WHERE id = @user_profile_id';