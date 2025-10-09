using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using StoryManagement.Model.Entity;

namespace MFTech.Model.Entity
{
    public partial class StoryContext : DbContext
    {
        public StoryContext()
        {
        }

        public StoryContext(DbContextOptions<StoryContext> options)
            : base(options)
        {
        }
        public virtual DbSet<Authors> Authors { get; set; } = null!;
        public virtual DbSet<Chapters> Chapters { get; set; } = null!;
        public virtual DbSet<GroupTag> GroupTags { get; set; } = null!;
        public virtual DbSet<Part_Chapter> Part_Chapters { get; set; } = null!;
        public virtual DbSet<Pseu> Pseus { get; set; } = null!;
        public virtual DbSet<Reviews> Reviews { get; set; } = null!;
        public virtual DbSet<Seri_Story> Seri_Stories { get; set; } = null!;
        public virtual DbSet<Series> Series { get; set; } = null!;
        public virtual DbSet<Story> Stories { get; set; } = null!;
        public virtual DbSet<Sub_Tag> Sub_Tags { get; set; } = null!;
        public virtual DbSet<Tags> Tags { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Authors>(entity =>
            {
                entity.ToTable("Authors");

                entity.Property(e => e.Name).HasMaxLength(2000);

                entity.Property(e => e.Style).HasMaxLength(4000);
            });
            modelBuilder.Entity<Chapters>(entity =>
            {
                entity.ToTable("Chapters");

                entity.Property(e => e.StoryId);
                entity.Property(e => e.Title);
                entity.Property(e => e.Content);
            });
            modelBuilder.Entity<GroupTag>(entity =>
            {
                entity.ToTable("GroupTag");

                entity.Property(e => e.Name);
                entity.Property(e => e.Definition);
                entity.Property(e => e.MultiSelect);
            });
            modelBuilder.Entity<Part_Chapter>(entity =>
            {
                entity.ToTable("Part_Chapter");

                entity.Property(e => e.Name).HasMaxLength(1000);

                entity.Property(e => e.IdStory);
            });
            modelBuilder.Entity<Pseu>(entity =>
            {
                entity.ToTable("Pseu");

                entity.Property(e => e.Pseudonym).HasMaxLength(2000);
            });
            modelBuilder.Entity<Reviews>(entity =>
            {
                entity.ToTable("Review");

                entity.Property(e => e.IdStory);

                entity.Property(e => e.Review);
                entity.Property(e => e.Opening);
            });
            modelBuilder.Entity<Scenes>(entity =>
            {
                entity.ToTable("Scene");

                entity.Property(e => e.Scene);
                entity.Property(e => e.Title);
                entity.Property(e => e.Description);
            });
            modelBuilder.Entity<Seri_Story>(entity =>
            {
                entity.ToTable("Seri_Story");

                entity.Property(e => e.Position);
            });
            modelBuilder.Entity<Series>(entity =>
            {
                entity.ToTable("Series");

                entity.Property(e => e.Name).HasMaxLength(2000).HasColumnName("SeriName");
            });
            modelBuilder.Entity<Story>(entity =>
            {
                entity.ToTable("Story");

                entity.Property(e => e.Name).HasMaxLength(300);
                entity.Property(e => e.NumberChapter).HasMaxLength(1000);
                entity.Property(e => e.IsRead);
                entity.Property(e => e.Tags_Name);
                entity.Property(e => e.Source);
            });
            modelBuilder.Entity<Sub_Tag>(entity =>
            {
                entity.ToTable("Sub_Tag");

                entity.Property(e => e.Name).HasMaxLength(500);
                entity.Property(e => e.Definition).HasMaxLength(4000);
            });
            modelBuilder.Entity<Tags>(entity =>
            {
                entity.ToTable("Tags");

                entity.Property(e => e.Name).HasMaxLength(200);
                entity.Property(e => e.Definition).HasMaxLength(4000);
            });
            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
