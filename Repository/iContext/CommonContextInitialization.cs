using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.iContext
{
    public sealed class CommonContextInitialization : DropCreateDatabaseAlways<CommonContext>
    {
        /*
         * seed the 'فناوران پارس' medical center to medical center database.
          
         */
        protected override void Seed(CommonContext context)
        {
            try
            {
                context.MedicalCenters.Add(new Model.MedicalCenter
                {

                    Id = Guid.Parse("1db03459-b169-46a4-87c6-52df2bec6a28"),
                    ConnectionString = "Data Source=192.168.1.10;initial catalog=MinaDent;user id=it;password=Ab123456;MultipleActiveResultSets=True;",
                    IsDeleted = false,
                    MedicalCenterId = Guid.Empty,
                    ModifiedDate = DateTime.Now,
                    Name = "فناوران پارس"
                });
                context.SaveChanges();




                ////CREATE FUNCTION[dbo].[fn_GetNewDocNO]()
                ////RETURNS varchar(10)
                ////BEGIN
                ////DECLARE @out nvarchar(10)


                ////select @out = convert(nvarchar(10), (MAX(IntDoc) + 1))

                ////from(
                ////select convert(int , c.DocNo ) IntDoc
                ////from[dbo].[Tbl_CustomerBasicInfo]
                ////c
                ////) d

                ////RETURN  @out
                ////END

                //            }
                //            catch (DbEntityValidationException e)
                //            {
                //                foreach (var eve in e.EntityValidationErrors)
                //                {
                //                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                //                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                //                    foreach (var ve in eve.ValidationErrors)
                //                    {
                //                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                //                            ve.PropertyName, ve.ErrorMessage);
                //                    }
                //                }
                //                throw;
                //            }
                //            base.Seed(context);
                //        }


            } catch
            {

            }

            }
    }

}
