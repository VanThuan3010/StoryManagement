ALTER PROCEDURE [dbo].[CreateOrUpdate_Tag]
	@Id int,
	@name nvarchar(2000),
	@definition nvarchar(4000)
as
begin
	if @Id <= 0
		insert into Tags(Name, Definition) values (@name, @definition)
	else
		update Tags
		set Name = @name, Definition = @definition
		where Id = @Id
end
***********************************************
ALTER PROCEDURE [dbo].[Delete_Tag]
	@id int
as
begin
	delete Tags where Id = @id
	if @@ROWCOUNT > 0
	begin
		delete Story_Tags where IdTag = @id
	end
end