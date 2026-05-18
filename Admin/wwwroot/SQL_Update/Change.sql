CREATE TABLE [dbo].[Story_Tags](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[IdStory] [int] NULL,
	[IdGroupTag] [int] NULL,
	[IdTag] [int] NULL,
	[MultiSelect] [bit] NULL,
 CONSTRAINT [PK_Story_Tags] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
---------------------------------------------
create PROCEDURE [dbo].[Get_StoryByAuthor]
	@Id int
as
begin
	select s.Id, s.Name
	from Story s
	where Id in (select IdStory from Story_Author where IdAuthor = @Id)
end
---------------------------------------------
create PROCEDURE [dbo].[Delete_Series]
	@id int
as
begin
	delete Series where Id = @id
	delete Seri_Story where SeriId = @id
end
--------------------------------------------
create PROCEDURE [dbo].[Get_AuthorByStory]
	@Id int
as
begin
	select a.Id, a.Pseudonym
	from Authors a
	where Id in (select IdAuthor from Story_Author where  IdStory = @Id)
end
----------------------------------------------
UPDATE [dbo].[Tags]
   SET [Name] = <Name, nvarchar(2000),>
      ,[Definition] = <Definition, nvarchar(4000),>
 WHERE <Search Conditions,,>
GO
-------------------------------------------
UPDATE [dbo].[Authors]
   SET [Pseudonym] = <Pseudonym, nvarchar(4000),>
      ,[Style] = <Style, nvarchar(max),>
 WHERE <Search Conditions,,>
GO
---------------------------------------------
ALTER PROCEDURE [dbo].[Get_SearchStoryForSeries]
	@search nvarchar(255),
	@idSelected nvarchar(4000)
as
begin
	declare @searchString nvarchar(300) = '%' + @search + '%';
	DECLARE @Data TABLE (
			Id int
		);
	DECLARE @result TABLE (Id int, Name nvarchar(4000));
	insert into @Data (Id)
	select cast(value as int) from Split_String(@idSelected, ',')

	insert into @result
	select top 5 Id, Name
	from Story where Id not in (select Id from @Data) and LOWER(Name) like @searchString

	select * from @result
end
------------------------------------------------
ALTER PROCEDURE [dbo].[Get_SearchStoryForAuthor]
	@search nvarchar(255),
	@idSelected nvarchar(4000)
as
begin
	set nocount on;
	declare @searchString nvarchar(300) = '%' + @search + '%';
	DECLARE @Data TABLE (
			Id int
		);
	insert into @Data (Id)
	select cast(value as int) from Split_String(@idSelected, ',')

	select top 5 Id, Name
	from Story where Id not in (select Id from @Data) and LOWER(Name) like @searchString
end
-----------------------------------------------------
ALTER PROCEDURE [dbo].[CreateOrUpdate_Author]
	@Id int,
	@pseudonym nvarchar(4000),
	@style nvarchar(max),
	@lstStory nvarchar(4000),
	@action nvarchar(20)
as
begin
	if @action = 'CreateOrUpdate'
	begin
	IF @Id <= 0 
		begin
			insert into Authors(Pseudonym, Style) values (@pseudonym, @style)

			set @Id = SCOPE_IDENTITY()
		end
		else
		begin
			update Authors
			set Pseudonym = @pseudonym, Style = @style
			where Id = @Id
		end		
	end
	else if @action = 'SaveLiterary'
	begin
		DECLARE @Data TABLE (
				IdStory int
			);

		INSERT INTO @Data (IdStory)
		SELECT
			JSON_VALUE(Value, '$.storyId')
		FROM OPENJSON(@lstStory);


		delete Story_Author where IdAuthor = @id and IdStory not in (select distinct IdStory from @Data)

		insert into Story_Author(IdStory, IdAuthor)
		select IdStory, @Id
		from @Data
		where IdStory not in (select IdStory from Story_Author where IdAuthor = @Id)
	end
end
----------------------------------------------------------
ALTER PROCEDURE [dbo].[CreateOrUpdate_Story]
	@Id int,
	@name nvarchar(2000),
	@numberChapter nvarchar(1000),
	@read bit,
	@tags nvarchar(4000),
	@authors nvarchar(4000),
	@source nvarchar(500)
as
begin
	SET NOCOUNT ON;
	------------------------------------------------
	IF @Id <= 0
	BEGIN
		INSERT INTO Story (Name, NumberChapter, IsRead, Source, CreateDate, TagsName)
		VALUES (@name, @numberChapter, @read, @source, GETDATE(), @tags);

		SET @Id = CAST(SCOPE_IDENTITY() AS INT);
	END
	ELSE
	BEGIN
		UPDATE Story
		SET Name = @name,
			NumberChapter = @numberChapter,
			IsRead = @read,
			ModifiedDate = GETDATE(),
			Source = @source,
			TagsName = @tags
		WHERE Id = @Id;

		--UPDATE Comic 
		--SET Name = @name
		--WHERE IdStory = @Id;
	END
	------------------------------------------------
	DECLARE @Data TABLE (
			IdAuthor int
		);

	INSERT INTO @Data (IdAuthor)
	SELECT
		JSON_VALUE(Value, '$.authorId')
	FROM OPENJSON(@authors);


	delete Story_Author where IdStory = @id and IdAuthor not in (select distinct IdAuthor from @Data)

	insert into Story_Author(IdStory, IdAuthor)
	select @Id, IdAuthor
	from @Data
	where IdAuthor not in (select IdAuthor from Story_Author where IdStory = @Id)
end
----------------------------------------------------------------
ALTER PROCEDURE [dbo].[Get_Story]
    @pageIndex int,
    @pageSize int,
    @search nvarchar(255),
    @stt nchar(10),
    @totalRow int OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    ------------------------------------------------
    CREATE TABLE #Data
    (
        Id int,
        Name NVARCHAR(3000),
        NumberChapter NVARCHAR(4000),
        IsRead bit,
        Source nvarchar(50),
        TagsName nvarchar(4000),
        ChapterUploaded nvarchar(4000),
        ReadChapter nvarchar(1000)
    );

    ;WITH ChapterStats AS
    (
        SELECT 
            c.StoryId,
            pc.Name,
            COUNT(c.Id) AS NumberChapters
        FROM Chapters c
        JOIN Part_Chapter pc 
            ON pc.Id = c.Belong
        GROUP BY c.StoryId, pc.Name
    ),
    ChapterAgg AS
    (
        SELECT
            StoryId,
            STRING_AGG(
                Name + N' (' 
                + CAST(NumberChapters AS NVARCHAR(20))
                + N' ch??ng)',
                CHAR(13) + CHAR(10)
            ) AS ChapterUploaded
        FROM ChapterStats
        GROUP BY StoryId
    )

    INSERT INTO #Data
    SELECT 
        s.Id,
        s.Name,
        s.NumberChapter,
        s.IsRead,
        s.Source,
        s.TagsName,
        ca.ChapterUploaded,
        c.Title AS ReadChapter
    FROM Story s
    LEFT JOIN Chapters c 
        ON c.Id = s.ReadTo
    LEFT JOIN ChapterAgg ca
        ON ca.StoryId = s.Id
    WHERE 
    (
        @search IS NULL 
        OR @search = ''
        OR s.Name LIKE '%' + @search + '%'
        OR (
            s.IsCollection = 1
            AND EXISTS (
                SELECT 1
                FROM Review r
                WHERE r.IdStory = s.Id
                    AND CHARINDEX(@search, r.Opening) > 0
            )
        )
    )
    AND (
        @stt = 'All' 
        OR s.IsRead = CASE WHEN @stt = 'Read' THEN 1 ELSE 0 END
    );

    SET @totalRow = (SELECT COUNT(*) FROM #Data);

    SELECT *
    FROM #Data
    ORDER BY Name
    OFFSET @pageIndex * @pageSize ROWS
    FETCH NEXT @pageSize ROWS ONLY;

    DROP TABLE #Data;
END
--------------------------------------------------------------
ALTER PROCEDURE [dbo].[CreateOrUpdate_Series]
	@id int,
	@name nvarchar(2000),
	@lstStory nvarchar(4000)
as
begin
    DECLARE @Data TABLE (
			IdStory int,
			Position int
		);

	INSERT INTO @Data (IdStory, Position)
	SELECT
		JSON_VALUE(Value, '$.storyId'),
		JSON_VALUE(Value, '$.position')
	FROM OPENJSON(@lstStory);

	if @id <= 0
	begin
		Insert into Series (SeriName) values (@name)
		set @id = SCOPE_IDENTITY()
	end
	else
		update Series set SeriName = @name where Id =@id

	delete Seri_Story where SeriId = @id and StoryId not in (select distinct IdStory from @Data)

	insert into Seri_Story (SeriId, StoryId, Position)
	select @id, IdStory, Position
	from @Data
	where IdStory not in (select IdStory from Seri_Story where SeriId = @id)
end
----------------------------------------------------------------
