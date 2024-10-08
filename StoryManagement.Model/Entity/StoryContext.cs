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

        public virtual DbSet<Story> Stories { get; set; } = null!;
        public virtual DbSet<Authors> Authors { get; set; } = null!;
        public virtual DbSet<Chapters> Chapters { get; set; } = null!;
        public virtual DbSet<Reviews> Reviews { get; set; } = null!;
        public virtual DbSet<Series> Series { get; set; } = null!;
        public virtual DbSet<Tags> Tags { get; set; } = null!;
        public virtual DbSet<Part_Chapter> Part_Chapters { get; set; } = null!;
        public virtual DbSet<Scenes> Scenes { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Story>(entity =>
            {
                entity.ToTable("Story");

                entity.Property(e => e.Name).HasMaxLength(300);

                entity.Property(e => e.NumberChapter).HasMaxLength(1000);

                entity.Property(e => e.IsRead);
                entity.Property(e => e.AuthorId);
                entity.Property(e => e.TagId);
            });
            modelBuilder.Entity<Authors>(entity =>
            {
                entity.ToTable("Authors");

                entity.Property(e => e.Name).HasMaxLength(2000);

                entity.Property(e => e.Pseudonym).HasMaxLength(200);
            });
            modelBuilder.Entity<Chapters>(entity =>
            {
                entity.ToTable("Chapters");

                entity.Property(e => e.StoryId);

                entity.Property(e => e.Title);
                entity.Property(e => e.Content);
            });
            modelBuilder.Entity<Reviews>(entity =>
            {
                entity.ToTable("Review");

                entity.Property(e => e.IdStory);

                entity.Property(e => e.Review);
                entity.Property(e => e.Opening);
            });
            modelBuilder.Entity<Series>(entity =>
            {
                entity.ToTable("Seri_Story");

                entity.Property(e => e.Name).HasMaxLength(500);

                entity.Property(e => e.StoryId);

                entity.Property(e => e.Seri);

                entity.Property(e => e.Position);
            });
            modelBuilder.Entity<Tags>(entity =>
            {
                entity.ToTable("Tags");

                entity.Property(e => e.Name).HasMaxLength(200);

                entity.Property(e => e.Definition).HasMaxLength(4000);
            });
            modelBuilder.Entity<Part_Chapter>(entity =>
            {
                entity.ToTable("Part_Chapter");

                entity.Property(e => e.Name).HasMaxLength(500);

                entity.Property(e => e.IdStory);
            });
            modelBuilder.Entity<Scenes>(entity =>
            {
                entity.ToTable("Scene");

                entity.Property(e => e.FromStory).HasMaxLength(1000);
                entity.Property(e => e.Scene);
                entity.Property(e => e.Title);
                entity.Property(e => e.Description);
                entity.Property(e => e.HighRate);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
