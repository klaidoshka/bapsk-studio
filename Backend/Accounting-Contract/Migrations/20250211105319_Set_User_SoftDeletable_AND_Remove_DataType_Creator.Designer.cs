﻿// <auto-generated />
using System;
using Accounting.Contract;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Accounting.Contract.Migrations
{
    [DbContext(typeof(AccountingDatabase))]
    [Migration("20250211105319_Set_User_SoftDeletable_AND_Remove_DataType_Creator")]
    partial class Set_User_SoftDeletable_AND_Remove_DataType_Creator
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

            modelBuilder.Entity("Accounting.Contract.Entity.DataEntry", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("CreatedById")
                        .HasColumnType("int");

                    b.Property<int>("DataTypeId")
                        .HasColumnType("int");

                    b.Property<bool?>("IsDeleted")
                        .HasColumnType("tinyint(1)");

                    b.Property<DateTime?>("ModifiedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<int?>("ModifiedById")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("CreatedById");

                    b.HasIndex("DataTypeId");

                    b.HasIndex("ModifiedById");

                    b.ToTable("DataEntries");
                });

            modelBuilder.Entity("Accounting.Contract.Entity.DataEntryField", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("DataEntryId")
                        .HasColumnType("int");

                    b.Property<int>("DataTypeFieldId")
                        .HasColumnType("int");

                    b.Property<string>("Value")
                        .IsRequired()
                        .HasMaxLength(2147483647)
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("DataEntryId");

                    b.HasIndex("DataTypeFieldId");

                    b.ToTable("DataEntryFields");
                });

            modelBuilder.Entity("Accounting.Contract.Entity.DataType", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Description")
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)");

                    b.Property<int>("InstanceId")
                        .HasColumnType("int");

                    b.Property<bool?>("IsDeleted")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.HasKey("Id");

                    b.HasIndex("InstanceId");

                    b.ToTable("DataTypes");
                });

            modelBuilder.Entity("Accounting.Contract.Entity.DataTypeField", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("DataTypeId")
                        .HasColumnType("int");

                    b.Property<string>("DefaultValue")
                        .HasColumnType("longtext");

                    b.Property<bool>("IsRequired")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("DataTypeId");

                    b.ToTable("DataTypeFields");
                });

            modelBuilder.Entity("Accounting.Contract.Entity.Instance", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("CreatedById")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .HasColumnType("longtext");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("CreatedById");

                    b.ToTable("Instances");
                });

            modelBuilder.Entity("Accounting.Contract.Entity.InstanceUserMeta", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("InstanceId")
                        .HasColumnType("int");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("InstanceId");

                    b.HasIndex("UserId");

                    b.ToTable("InstanceUserMetas");
                });

            modelBuilder.Entity("Accounting.Contract.Entity.SaleTaxFreeDeclaration", b =>
                {
                    b.Property<string>("Id")
                        .HasMaxLength(34)
                        .HasColumnType("varchar(34)");

                    b.Property<int>("Correction")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("SaleTaxFreeDeclarations");
                });

            modelBuilder.Entity("Accounting.Contract.Entity.Session", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("Agent")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("IpAddress")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Location")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("RefreshToken")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("UserId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Sessions");
                });

            modelBuilder.Entity("Accounting.Contract.Entity.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<DateTime>("BirthDate")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("Country")
                        .HasColumnType("int");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("EmailNormalized")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<bool>("IsDeleted")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("EmailNormalized")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("Accounting.Contract.Entity.DataEntry", b =>
                {
                    b.HasOne("Accounting.Contract.Entity.User", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedById")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Accounting.Contract.Entity.DataType", "DataType")
                        .WithMany()
                        .HasForeignKey("DataTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Accounting.Contract.Entity.User", "ModifiedBy")
                        .WithMany()
                        .HasForeignKey("ModifiedById");

                    b.Navigation("CreatedBy");

                    b.Navigation("DataType");

                    b.Navigation("ModifiedBy");
                });

            modelBuilder.Entity("Accounting.Contract.Entity.DataEntryField", b =>
                {
                    b.HasOne("Accounting.Contract.Entity.DataEntry", "DataEntry")
                        .WithMany("Fields")
                        .HasForeignKey("DataEntryId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Accounting.Contract.Entity.DataTypeField", "DataTypeField")
                        .WithMany()
                        .HasForeignKey("DataTypeFieldId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("DataEntry");

                    b.Navigation("DataTypeField");
                });

            modelBuilder.Entity("Accounting.Contract.Entity.DataType", b =>
                {
                    b.HasOne("Accounting.Contract.Entity.Instance", "Instance")
                        .WithMany()
                        .HasForeignKey("InstanceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Instance");
                });

            modelBuilder.Entity("Accounting.Contract.Entity.DataTypeField", b =>
                {
                    b.HasOne("Accounting.Contract.Entity.DataType", "DataType")
                        .WithMany("Fields")
                        .HasForeignKey("DataTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("DataType");
                });

            modelBuilder.Entity("Accounting.Contract.Entity.Instance", b =>
                {
                    b.HasOne("Accounting.Contract.Entity.User", "CreatedBy")
                        .WithMany("InstancesCreated")
                        .HasForeignKey("CreatedById")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CreatedBy");
                });

            modelBuilder.Entity("Accounting.Contract.Entity.InstanceUserMeta", b =>
                {
                    b.HasOne("Accounting.Contract.Entity.Instance", "Instance")
                        .WithMany("UserMetas")
                        .HasForeignKey("InstanceId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Accounting.Contract.Entity.User", "User")
                        .WithMany("InstanceUserMetas")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Instance");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Accounting.Contract.Entity.Session", b =>
                {
                    b.HasOne("Accounting.Contract.Entity.User", "User")
                        .WithMany("Sessions")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("Accounting.Contract.Entity.DataEntry", b =>
                {
                    b.Navigation("Fields");
                });

            modelBuilder.Entity("Accounting.Contract.Entity.DataType", b =>
                {
                    b.Navigation("Fields");
                });

            modelBuilder.Entity("Accounting.Contract.Entity.Instance", b =>
                {
                    b.Navigation("UserMetas");
                });

            modelBuilder.Entity("Accounting.Contract.Entity.User", b =>
                {
                    b.Navigation("InstanceUserMetas");

                    b.Navigation("InstancesCreated");

                    b.Navigation("Sessions");
                });
#pragma warning restore 612, 618
        }
    }
}
