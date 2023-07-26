using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;

using Repository.iContext;
using Repository.Model;
using System.Data.Entity.Validation;
using System.Runtime.Remoting.Contexts;
using System.Threading;
using System.Globalization;
using System.Linq.Dynamic;
using System.Threading.Tasks;
using Task = System.Threading.Tasks.Task;

namespace Repository
{
    public class MasterRepository<T> : IRepository<T>, IDisposable where T : class
    {
        public FrameworkContext FrameworkContext { get; set; }
        public IContextFactory DbFactory { get; set; }
        //public MasterRepository(FrameworkContext context)
        //{
        //    FrameworkContext = context;
        //} DbFactory = dbFactory;

        public async Task<IQueryable<T>> Get(Expression<Func<T, bool>> predicate)
        {
            try
            {
                return (await Task.FromResult(FrameworkContext.Set<T>().Where(predicate))).AsNoTracking();
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task<int> TCount(Expression<Func<T, bool>> predicate)
        {
            try
            {
                return await Task.FromResult(FrameworkContext.Set<T>().Where(predicate).Count());
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task<IQueryable<T>> GetAsNoTracking(Expression<Func<T, bool>> predicate)
        {
            try
            {
                return await Task.FromResult(FrameworkContext.Set<T>().Where(predicate));
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task<T> First(Expression<Func<T, bool>> predicate)
        {
            try
            {
                return await Task.FromResult(FrameworkContext.Set<T>().Where(predicate).AsNoTracking().FirstOrDefault());
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task<T> Find(object key)
        {
            try
            {
                return await FrameworkContext.Set<T>().FindAsync(key);
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task Commit(T entity = default(T), T oldEntity = default(T), string userId = null, Guid? medicalCenterId = null)
        {
            try
            {
                await FrameworkContext.SaveChangesAsync();
                switch (typeof(T).FullName)
                {
                    case "Repository.Model.Doing":
                        await DoingEventLog(entity, 'E', userId, medicalCenterId, oldEntity);
                        break;
                    case "VisitTime":

                        break;
                }
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task<IQueryable<T>> GetAll()
        {
            try
            {
                return await Task.FromResult(FrameworkContext.Set<T>());
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task<int> CountAll()
        {
            try
            {
                return await Task.FromResult(FrameworkContext.Set<T>().Count());
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task<IQueryable<T>> GetAllOrderBy(Func<T, object> keySelector)
        {
            try
            {
                return await Task.FromResult(FrameworkContext.Set<T>().OrderBy(keySelector).AsQueryable().AsNoTracking());
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task<IQueryable<T>> GetAllOrderByDescending(Func<T, object> keySelector)
        {
            try
            {
                return await Task.FromResult(FrameworkContext.Set<T>().OrderByDescending(keySelector).AsQueryable().AsNoTracking());
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task<IEnumerable<T>> RunTQuery(string sqlStr)
        {
            try
            {
                return await Task.FromResult(FrameworkContext.Database.SqlQuery<T>(sqlStr));
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task<IQueryable<TClass>> RunQuery<TClass>(string sqlStr) where TClass : class, new()
        {
            try
            {                //return await Task.FromResult(FrameworkContext.Database.SqlQuery<TClass>(sqlStr).ToList());
                //return await FrameworkContext.Database.SqlQuery<TClass>(sqlStr).ToListAsync();

                return  (FrameworkContext.Database.SqlQuery<TClass>(sqlStr).AsQueryable());
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }

        public async Task<IEnumerable<TClass>> RunQuery<TClass>(string spName, object[] parameters) where TClass : class, new()
        {
            try
            {
                return await FrameworkContext.Database.SqlQuery<TClass>("exec " + spName, parameters).ToListAsync();
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }

        public async Task<IEnumerable<dynamic>> RunQuery(string sqlStr)
        {
            try
            {
                return await Task.FromResult(FrameworkContext.Database.SqlQuery<object>(sqlStr));
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }

        public async Task<bool> CustomAny(Expression<Func<T, bool>> predicate)
        {
            try
            {
                return await Task.FromResult(FrameworkContext.Set<T>().Any(predicate));
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }

        public async Task<T> AddWithReturn(T entity)
        {
            try
            {

                entity.GetType().GetProperty("Id").SetValue(entity, Guid.NewGuid());
                entity.GetType().GetProperty("ModifiedDate").SetValue(entity, DateTime.Now);
                FrameworkContext.Set<T>().Add(entity);
                await FrameworkContext.SaveChangesAsync();
                return entity;
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }


        public async Task<string> GenerateDeleteSqlStr(string tableName, string condition)
        {
            try
            {
                return await Task.FromResult("Update " + tableName + "set IsDeleted=1 where " + condition);
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }






        //------------Event Log
        #region
        public async Task Add(T entity, string userId = null, Guid? medicalCenterId = null)
        {
            try
            {

                entity.GetType().GetProperty("Id").SetValue(entity, Guid.NewGuid());
                entity.GetType().GetProperty("ModifiedDate").SetValue(entity, DateTime.Now);
                FrameworkContext.Set<T>().Add(entity);
                await FrameworkContext.SaveChangesAsync();

                switch (typeof(T).FullName)
                {
                    case "Repository.Model.Doing":
                        await DoingEventLog(entity, 'I', userId, medicalCenterId);
                        break;
                    case "VisitTime":

                        break;
                }
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task<T> AddIntWithReturn(T entity, string userId = null, Guid? medicalCenterId = null)
        {
            try
            {

                entity.GetType().GetProperty("ModifiedDate").SetValue(entity, DateTime.Now);
                T res = FrameworkContext.Set<T>().Add(entity);
                await FrameworkContext.SaveChangesAsync();

                switch (typeof(T).FullName)
                {
                    case "Repository.Model.VisitTime":
                        await VisitTimeEventLog(entity, 'I', userId, medicalCenterId);
                        break;
                }
                return res;
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task Update(T entity, T oldEntity = default(T), string userId = null, Guid? medicalCenterId = null)
        {
            try
            {
                entity.GetType().GetProperty("ModifiedDate").SetValue(entity, DateTime.Now);
                FrameworkContext.Set<T>().Attach(entity);
                FrameworkContext.Entry(entity).State = System.Data.Entity.EntityState.Modified;

                await FrameworkContext.SaveChangesAsync();

                switch (typeof(T).FullName)
                {
                    case "Repository.Model.Doing":
                        await DoingEventLog(entity, 'E', userId, medicalCenterId, oldEntity);
                        break;
                    case "Repository.Model.VisitTime":
                        await VisitTimeEventLog(entity, 'E', userId, medicalCenterId, oldEntity);
                        break;
                    case "Repository.Model.Customer_Insurance":
                        await CustomerInsuranceEventLog(entity, 'E', userId, medicalCenterId, oldEntity);
                        break;
                }
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task LogicalDelete(T entity, T oldEntity = default(T), string userId = null, Guid? medicalCenterId = null)
        {
            try
            {
                FrameworkContext.Set<T>().Remove(entity);
                await FrameworkContext.SaveChangesAsync();

                switch (typeof(T).FullName)
                {
                    case "Repository.Model.Doing":
                        await DoingEventLog(entity, 'D', userId, medicalCenterId, oldEntity);
                        break;
                    case "Repository.Model.VisitTime":
                        await VisitTimeEventLog(entity, 'D', userId, medicalCenterId, oldEntity);
                        break;
                    case "Repository.Model.WarehouseHeader":
                        await WarehouseHeaderEventLog(oldEntity, 'D', userId, medicalCenterId, oldEntity);
                        break;
                    case "Repository.Model.WarehouseItem":
                        await WarehouseItemEventLog(entity, 'D', userId, medicalCenterId, oldEntity);
                        break;
                }
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task LogicalDelete(Expression<Func<T, bool>> predicate, T oldEntity = default(T), string userId = null, Guid? medicalCenterId = null)
        {
            try
            {
                foreach (var item in (await FrameworkContext.Set<T>().Where(predicate).ToListAsync()))
                {
                    FrameworkContext.Set<T>().Remove(item);


                    switch (typeof(T).FullName)
                    {
                        case "Repository.Model.Doing":
                            await DoingEventLog(oldEntity, 'D', userId, medicalCenterId, oldEntity);
                            break;
                        case "Repository.Model.VisitTime":
                            await VisitTimeEventLog(oldEntity, 'D', userId, medicalCenterId, oldEntity);
                            break;
                        case "Repository.Model.WarehouseHeader":
                            await WarehouseHeaderEventLog(item, 'D', userId, medicalCenterId, item);
                            break;
                        case "Repository.Model.WarehouseItem":
                            await WarehouseItemEventLog(item, 'D', userId, medicalCenterId, item);
                            break;
                    }
                }
                await FrameworkContext.SaveChangesAsync();
            }
            catch (DbEntityValidationException e)
            {
                throw;
            }
        }


        public async Task AddMultiSaveChange(T entity, string userId = null, Guid? medicalCenterId = null)
        {
            try
            {
                entity.GetType().GetProperty("ModifiedDate").SetValue(entity, DateTime.Now);
                FrameworkContext.Set<T>().Add(entity);

                switch (typeof(T).FullName)
                {
                    case "Repository.Model.WarehouseItem":
                        await WarehouseItemEventLog(entity, 'I', userId, medicalCenterId);
                        break;
                }
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task AddInt(T entity, string userId = null, Guid? medicalCenterId = null)
        {
            try
            {//Repository.Model.WarehouseItem
                entity.GetType().GetProperty("ModifiedDate").SetValue(entity, DateTime.Now);
                FrameworkContext.Set<T>().Add(entity);
                await FrameworkContext.SaveChangesAsync();


                switch (typeof(T).FullName)
                {
                    case "Repository.Model.WarehouseHeader":
                        await WarehouseHeaderEventLog(entity, 'I', userId, medicalCenterId);
                        break;
                    case "Repository.Model.WarehouseItem":
                        await WarehouseItemEventLog(entity, 'I', userId, medicalCenterId);
                        break;
                    case "Repository.Model.Customer_Insurance":
                        await CustomerInsuranceEventLog(entity, 'I', userId, medicalCenterId);
                        break;
                }
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }


        }




        ////////////////////////////////////Start Event Log///////////////////////////////////////////////////////
        public async Task DoingEventLog(T entity, char status, string userId = null, Guid? medicalCenterId = null, T oldEntity = default(T))
        {
            try
            {
                //Check Not Eqaual entity And oldEntity                
                if (entity.Equals(oldEntity) && status != 'D') return;


                var db = DbFactory.GetContext();

                string moneyTypeOld = oldEntity != null && entity.GetType().GetProperty("MoneyType").GetValue(oldEntity) != null ? entity.GetType().GetProperty("MoneyType").GetValue(oldEntity).ToString() : null;
                string moneyTypeNew = entity.GetType().GetProperty("MoneyType").GetValue(entity) != null ? entity.GetType().GetProperty("MoneyType").GetValue(entity).ToString() : null;

                string walletCode = entity.GetType().GetProperty("walletcode").GetValue(entity) != null ? entity.GetType().GetProperty("walletcode").GetValue(entity).ToString() : null;

                string doingChildCodeOld = oldEntity != null && entity.GetType().GetProperty("DoingChildCode").GetValue(oldEntity) != null ? entity.GetType().GetProperty("DoingChildCode").GetValue(oldEntity).ToString() : null;
                string doingChildCodeNew = entity.GetType().GetProperty("DoingChildCode").GetValue(entity) != null ? entity.GetType().GetProperty("DoingChildCode").GetValue(entity).ToString() : null;
                var _doingChildCode = await db.Codings.Where(x => x.code == doingChildCodeNew).FirstOrDefaultAsync();
                if (_doingChildCode == null)
                {
                    doingChildCodeNew = null;
                    doingChildCodeOld = null;
                }

                string oldDoctor = oldEntity != null && entity.GetType().GetProperty("DoctorId").GetValue(oldEntity) != null ? entity.GetType().GetProperty("DoctorId").GetValue(oldEntity).ToString() : null;
                string newDoctor = entity.GetType().GetProperty("DoctorId").GetValue(entity) != null ? entity.GetType().GetProperty("DoctorId").GetValue(entity).ToString() : null;


                db.EventLog.Add(new EventLog
                {
                    Id = Guid.NewGuid(),
                    EditTime = DateTime.Now,
                    ModifiedDate = DateTime.Now,
                    IsDeleted = false,
                    TblName = typeof(T).FullName,

                    //DocNo
                    OldVal1 = status != 'I' && entity.GetType().GetProperty("DocNo").GetValue(oldEntity) != null ? entity.GetType().GetProperty("DocNo").GetValue(oldEntity).ToString() : null,
                    NewVal1 = status != 'D' && entity.GetType().GetProperty("DocNo").GetValue(entity) != null ? entity.GetType().GetProperty("DocNo").GetValue(entity).ToString() : null,

                    //Price
                    OldVal3 = status != 'I' && entity.GetType().GetProperty("Price").GetValue(oldEntity) != null ? entity.GetType().GetProperty("Price").GetValue(oldEntity).ToString() : null,
                    NewVal3 = status != 'D' && entity.GetType().GetProperty("Price").GetValue(entity) != null ? entity.GetType().GetProperty("Price").GetValue(entity).ToString() : null,

                    //ImPortPrice
                    OldVal5 = status != 'I' && entity.GetType().GetProperty("ImPortPrice").GetValue(oldEntity) != null ? entity.GetType().GetProperty("ImPortPrice").GetValue(oldEntity).ToString() : null,
                    NewVal5 = status != 'D' && entity.GetType().GetProperty("ImPortPrice").GetValue(entity) != null ? entity.GetType().GetProperty("ImPortPrice").GetValue(entity).ToString() : null,

                    //Date
                    OldVal4 = status != 'I' && entity.GetType().GetProperty("Date").GetValue(oldEntity) != null ? entity.GetType().GetProperty("Date").GetValue(oldEntity).ToString() : null,
                    NewVal4 = status != 'D' && entity.GetType().GetProperty("Date").GetValue(entity) != null ? entity.GetType().GetProperty("Date").GetValue(entity).ToString() : null,

                    //DoingChildCode
                    OldVal2 = status != 'I' && doingChildCodeOld != null ? doingChildCodeOld : null,
                    NewVal2 = status != 'D' && doingChildCodeNew != null ? doingChildCodeNew : null,

                    //MoneyType
                    OldVal6 = status != 'I' && moneyTypeOld != null ? moneyTypeOld : null,
                    NewVal6 = status != 'D' && moneyTypeNew != null ? moneyTypeNew : null,

                    //walletchange
                    OldVal11 = status != 'I' && entity.GetType().GetProperty("walletchange").GetValue(oldEntity) != null ? entity.GetType().GetProperty("walletchange").GetValue(oldEntity).ToString() : null,
                    NewVal11 = status != 'D' && entity.GetType().GetProperty("walletchange").GetValue(entity) != null ? entity.GetType().GetProperty("walletchange").GetValue(entity).ToString() : null,

                    //DoctorId
                    OldVal8 = status != 'I' && oldDoctor != null ? (oldDoctor) : null,
                    NewVal8 = status != 'D' && newDoctor != null ? (newDoctor) : null,

                    //walletcode                    
                    changewalletcode = status != 'D' && walletCode != null ? walletCode : null,

                    UserName = !string.IsNullOrEmpty(userId) ? (await db.PubUsers.Where(p => p.Id.ToString().Equals(userId)).FirstOrDefaultAsync()).UserName : null,
                    MedicalCenterId = medicalCenterId.Value,
                    Status = status.ToString(),
                });
                await db.SaveChangesAsync();
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task VisitTimeEventLog(T entity, char status, string userId = null, Guid? medicalCenterId = null, T oldEntity = default(T))
        {
            try
            {
                //Check Not Eqaual entity And oldEntity
                if (entity.Equals(oldEntity) && status != 'D') return;


                var db = DbFactory.GetContext();


                string oldDoctor = oldEntity != null && entity.GetType().GetProperty("DoctorId").GetValue(oldEntity) != null ? entity.GetType().GetProperty("DoctorId").GetValue(oldEntity).ToString() : null;
                string newDoctor = entity.GetType().GetProperty("DoctorId").GetValue(entity) != null ? entity.GetType().GetProperty("DoctorId").GetValue(entity).ToString() : null;

                var _model = new EventLog
                {
                    Id = Guid.NewGuid(),
                    EditTime = DateTime.Now,
                    ModifiedDate = DateTime.Now,
                    IsDeleted = false,
                    TblName = typeof(T).FullName,

                    //Employeeid
                    OldVal1 = status != 'I' && entity.GetType().GetProperty("Employeeid").GetValue(oldEntity) != null ? entity.GetType().GetProperty("Employeeid").GetValue(oldEntity).ToString() : null,
                    NewVal1 = status != 'D' && entity.GetType().GetProperty("Employeeid").GetValue(entity) != null ? entity.GetType().GetProperty("Employeeid").GetValue(entity).ToString() : null,

                    //MobileNumber
                    OldVal2 = status != 'I' && entity.GetType().GetProperty("VisitCrMobileNo").GetValue(oldEntity) != null ? entity.GetType().GetProperty("VisitCrMobileNo").GetValue(oldEntity).ToString() : null,
                    NewVal2 = status != 'D' && entity.GetType().GetProperty("VisitCrMobileNo").GetValue(entity) != null ? entity.GetType().GetProperty("VisitCrMobileNo").GetValue(entity).ToString() : null,

                    //CustomerId
                    OldVal3 = status != 'I' && entity.GetType().GetProperty("CustomerId").GetValue(oldEntity) != null ? entity.GetType().GetProperty("CustomerId").GetValue(oldEntity).ToString() : null,
                    NewVal3 = status != 'D' && entity.GetType().GetProperty("CustomerId").GetValue(entity) != null ? entity.GetType().GetProperty("CustomerId").GetValue(entity).ToString() : null,

                    //DoctorId
                    OldVal5 = status != 'I' && entity.GetType().GetProperty("DoctorId").GetValue(oldEntity) != null ? entity.GetType().GetProperty("DoctorId").GetValue(oldEntity).ToString() : null,
                    NewVal5 = status != 'D' && entity.GetType().GetProperty("DoctorId").GetValue(entity) != null ? entity.GetType().GetProperty("DoctorId").GetValue(entity).ToString() : null,

                    //VisitHdrDoingCode
                    OldVal6 = status != 'I' && entity.GetType().GetProperty("VisitHdrDoingCode").GetValue(oldEntity) != null ? entity.GetType().GetProperty("VisitHdrDoingCode").GetValue(oldEntity).ToString() : null,
                    NewVal6 = status != 'D' && entity.GetType().GetProperty("VisitHdrDoingCode").GetValue(entity) != null ? entity.GetType().GetProperty("VisitHdrDoingCode").GetValue(entity).ToString() : null,
                    
                    //VisitDoingCode
                    OldVal7 = status != 'I' && entity.GetType().GetProperty("VisitDoingCode").GetValue(oldEntity) != null ? entity.GetType().GetProperty("VisitDoingCode").GetValue(oldEntity).ToString() : null,
                    NewVal7 = status != 'D' && entity.GetType().GetProperty("VisitDoingCode").GetValue(entity) != null ? entity.GetType().GetProperty("VisitDoingCode").GetValue(entity).ToString() : null,

                    //FromTime
                    OldVal4 = status != 'I' && entity.GetType().GetProperty("FromTime").GetValue(oldEntity) != null ? entity.GetType().GetProperty("FromTime").GetValue(oldEntity).ToString() : null,
                    NewVal4 = status != 'D' && entity.GetType().GetProperty("FromTime").GetValue(entity) != null ? entity.GetType().GetProperty("FromTime").GetValue(entity).ToString() : null,

                    //ToTime
                    OldVal11 = status != 'I' && entity.GetType().GetProperty("ToTime").GetValue(oldEntity) != null ? entity.GetType().GetProperty("ToTime").GetValue(oldEntity).ToString() : null,
                    NewVal11 = status != 'D' && entity.GetType().GetProperty("ToTime").GetValue(entity) != null ? entity.GetType().GetProperty("ToTime").GetValue(entity).ToString() : null,


                    UserName = !string.IsNullOrEmpty(userId) ? (await db.PubUsers.Where(p => p.Id.ToString().Equals(userId)).FirstOrDefaultAsync()).UserName : null,
                    MedicalCenterId = medicalCenterId.Value,
                    Status = status.ToString(),
                };

                try
                {
                    //Id
                    _model.OldVal9 = status != 'I' && entity.GetType().GetProperty("AutoID").GetValue(oldEntity) != null ? entity.GetType().GetProperty("AutoID").GetValue(oldEntity).ToString() : null;
                    _model.NewVal9 = status != 'D' && entity.GetType().GetProperty("AutoID").GetValue(entity) != null ? entity.GetType().GetProperty("AutoID").GetValue(entity).ToString() : null;
                }
                catch (Exception ex)
                {

                }


                db.EventLog.Add(_model);
                await db.SaveChangesAsync();
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task CustomerInsuranceEventLog(T entity, char status, string userId = null, Guid? medicalCenterId = null, T oldEntity = default(T))
        {
            try
            {
                //Check Not Eqaual entity And oldEntity
                if (entity.Equals(oldEntity) && status != 'D') return;


                var db = DbFactory.GetContext();


                db.EventLog.Add(new EventLog
                {
                    Id = Guid.NewGuid(),
                    EditTime = DateTime.Now,
                    ModifiedDate = DateTime.Now,
                    IsDeleted = false,
                    TblName = typeof(T).FullName,

                    //InsuranceCode
                    OldVal1 = status != 'I' && entity.GetType().GetProperty("InsuranceCode").GetValue(oldEntity) != null ? entity.GetType().GetProperty("InsuranceCode").GetValue(oldEntity).ToString() : null,
                    NewVal1 = status != 'D' && entity.GetType().GetProperty("InsuranceCode").GetValue(entity) != null ? entity.GetType().GetProperty("InsuranceCode").GetValue(entity).ToString() : null,

                    //ciInsuranceBeginDateEn
                    OldVal2 = status != 'I' && entity.GetType().GetProperty("ciInsuranceBeginDateEn").GetValue(oldEntity) != null ? entity.GetType().GetProperty("ciInsuranceBeginDateEn").GetValue(oldEntity).ToString() : null,
                    NewVal2 = status != 'D' && entity.GetType().GetProperty("ciInsuranceBeginDateEn").GetValue(entity) != null ? entity.GetType().GetProperty("ciInsuranceBeginDateEn").GetValue(entity).ToString() : null,

                    //ciInsuranceEndDateEn
                    OldVal3 = status != 'I' && entity.GetType().GetProperty("CustomerId").GetValue(entity) != null ? entity.GetType().GetProperty("CustomerId").GetValue(entity).ToString() : null,
                    NewVal3 = status != 'D' && entity.GetType().GetProperty("CustomerId").GetValue(entity) != null ? entity.GetType().GetProperty("CustomerId").GetValue(entity).ToString() : null,

                    //ciInsuranceEndDateEn
                    OldVal4 = status != 'I' && entity.GetType().GetProperty("ciInsuranceEndDateEn").GetValue(oldEntity) != null ? entity.GetType().GetProperty("ciInsuranceEndDateEn").GetValue(oldEntity).ToString() : null,
                    NewVal4 = status != 'D' && entity.GetType().GetProperty("ciInsuranceEndDateEn").GetValue(entity) != null ? entity.GetType().GetProperty("ciInsuranceEndDateEn").GetValue(entity).ToString() : null,

                    //ciInsurancePercent
                    OldVal5 = status != 'I' && entity.GetType().GetProperty("ciInsurancePercent").GetValue(oldEntity) != null ? entity.GetType().GetProperty("ciInsurancePercent").GetValue(oldEntity).ToString() : null,
                    NewVal5 = status != 'D' && entity.GetType().GetProperty("ciInsurancePercent").GetValue(entity) != null ? entity.GetType().GetProperty("ciInsurancePercent").GetValue(entity).ToString() : null,

                    //ciLimitPrice
                    OldVal6 = status != 'I' && entity.GetType().GetProperty("ciLimitPrice").GetValue(oldEntity) != null ? entity.GetType().GetProperty("ciLimitPrice").GetValue(oldEntity).ToString() : null,
                    NewVal6 = status != 'D' && entity.GetType().GetProperty("ciLimitPrice").GetValue(entity) != null ? entity.GetType().GetProperty("ciLimitPrice").GetValue(entity).ToString() : null,

                    //ciInsuranceIsCurrent
                    OldVal7 = status != 'I' && entity.GetType().GetProperty("ciInsuranceIsCurrent").GetValue(oldEntity) != null ? entity.GetType().GetProperty("ciInsuranceIsCurrent").GetValue(oldEntity).ToString() : null,
                    NewVal7 = status != 'D' && entity.GetType().GetProperty("ciInsuranceIsCurrent").GetValue(entity) != null ? entity.GetType().GetProperty("ciInsuranceIsCurrent").GetValue(entity).ToString() : null,

                    UserName = !string.IsNullOrEmpty(userId) ? (await db.PubUsers.Where(p => p.Id.ToString().Equals(userId)).FirstOrDefaultAsync()).UserName : null,
                    MedicalCenterId = medicalCenterId.Value,
                    Status = status.ToString(),
                });
                await db.SaveChangesAsync();
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }


        public async Task WarehouseHeaderEventLog(T entity, char status, string userId = null, Guid? medicalCenterId = null, T oldEntity = default(T))
        {
            try
            {
                //Check Not Eqaual entity And oldEntity
                if (entity.Equals(oldEntity) && status != 'D') return;


                var db = DbFactory.GetContext();


                db.EventLog.Add(new EventLog
                {
                    Id = Guid.NewGuid(),
                    EditTime = DateTime.Now,
                    ModifiedDate = DateTime.Now,
                    IsDeleted = false,
                    TblName = typeof(T).FullName,

                    //vchhdrID
                    OldVal1 = status != 'I' && entity.GetType().GetProperty("vchhdrID").GetValue(oldEntity) != null ? entity.GetType().GetProperty("vchhdrID").GetValue(oldEntity).ToString() : null,
                    NewVal1 = status != 'D' && entity.GetType().GetProperty("vchhdrID").GetValue(entity) != null ? entity.GetType().GetProperty("vchhdrID").GetValue(entity).ToString() : null,

                    //vchhdrNo
                    OldVal2 = status != 'I' && entity.GetType().GetProperty("vchhdrNo").GetValue(oldEntity) != null ? entity.GetType().GetProperty("vchhdrNo").GetValue(oldEntity).ToString() : null,
                    NewVal2 = status != 'D' && entity.GetType().GetProperty("vchhdrNo").GetValue(entity) != null ? entity.GetType().GetProperty("vchhdrNo").GetValue(entity).ToString() : null,

                    //vchhdrIO
                    OldVal3 = status != 'I' && entity.GetType().GetProperty("vchhdrIO").GetValue(oldEntity) != null ? entity.GetType().GetProperty("vchhdrIO").GetValue(oldEntity).ToString() : null,
                    NewVal3 = status != 'D' && entity.GetType().GetProperty("vchhdrIO").GetValue(entity) != null ? entity.GetType().GetProperty("vchhdrIO").GetValue(entity).ToString() : null,

                    //vchhdrConsumerID
                    OldVal4 = status != 'I' && entity.GetType().GetProperty("vchhdrConsumerID").GetValue(oldEntity) != null ? entity.GetType().GetProperty("vchhdrConsumerID").GetValue(oldEntity).ToString() : null,
                    NewVal4 = status != 'D' && entity.GetType().GetProperty("vchhdrConsumerID").GetValue(entity) != null ? entity.GetType().GetProperty("vchhdrConsumerID").GetValue(entity).ToString() : null,

                    //vchhdrSupplier
                    OldVal5 = status != 'I' && entity.GetType().GetProperty("vchhdrSupplier").GetValue(oldEntity) != null ? entity.GetType().GetProperty("vchhdrSupplier").GetValue(oldEntity).ToString() : null,
                    NewVal5 = status != 'D' && entity.GetType().GetProperty("vchhdrSupplier").GetValue(entity) != null ? entity.GetType().GetProperty("vchhdrSupplier").GetValue(entity).ToString() : null,

                    //InvoiceNumber
                    OldVal6 = status != 'I' && entity.GetType().GetProperty("InvoiceNumber").GetValue(oldEntity) != null ? entity.GetType().GetProperty("InvoiceNumber").GetValue(oldEntity).ToString() : null,
                    NewVal6 = status != 'D' && entity.GetType().GetProperty("InvoiceNumber").GetValue(entity) != null ? entity.GetType().GetProperty("InvoiceNumber").GetValue(entity).ToString() : null,

                    //vchhdrDateEn
                    OldVal7 = status != 'I' && entity.GetType().GetProperty("vchhdrDateEn").GetValue(oldEntity) != null ? entity.GetType().GetProperty("vchhdrDateEn").GetValue(oldEntity).ToString() : null,
                    NewVal7 = status != 'D' && entity.GetType().GetProperty("vchhdrDateEn").GetValue(entity) != null ? entity.GetType().GetProperty("vchhdrDateEn").GetValue(entity).ToString() : null,

                    UserName = !string.IsNullOrEmpty(userId) ? (await db.PubUsers.Where(p => p.Id.ToString().Equals(userId)).FirstOrDefaultAsync()).UserName : null,
                    MedicalCenterId = medicalCenterId.Value,
                    Status = status.ToString(),
                });
                await db.SaveChangesAsync();
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task WarehouseItemEventLog(T entity, char status, string userId = null, Guid? medicalCenterId = null, T oldEntity = default(T))
        {
            try
            {
                //Check Not Eqaual entity And oldEntity
                if (entity.Equals(oldEntity) && status != 'D') return;


                var db = DbFactory.GetContext();

                int _headerId = entity.GetType().GetProperty("vchitmHdrRef").GetValue(entity) != null ? Convert.ToInt32(entity.GetType().GetProperty("vchitmHdrRef").GetValue(entity).ToString()) : 0;
                var _header = db.WarehouseHeaders.Where(x => x.vchhdrID == _headerId).FirstOrDefault();
                if (_header != null)
                {
                    db.EventLog.Add(new EventLog
                    {
                        Id = Guid.NewGuid(),
                        EditTime = DateTime.Now,
                        ModifiedDate = DateTime.Now,
                        IsDeleted = false,
                        TblName = typeof(T).FullName,

                        //vchitmHdrRef
                        OldVal1 = status != 'I' && entity.GetType().GetProperty("vchitmHdrRef").GetValue(oldEntity) != null ? entity.GetType().GetProperty("vchitmHdrRef").GetValue(oldEntity).ToString() : null,
                        NewVal1 = status != 'D' && entity.GetType().GetProperty("vchitmHdrRef").GetValue(entity) != null ? entity.GetType().GetProperty("vchitmHdrRef").GetValue(entity).ToString() : null,

                        //vchitmPartID
                        OldVal2 = status != 'I' && entity.GetType().GetProperty("vchitmPartID").GetValue(oldEntity) != null ? entity.GetType().GetProperty("vchitmPartID").GetValue(oldEntity).ToString() : null,
                        NewVal2 = status != 'D' && entity.GetType().GetProperty("vchitmPartID").GetValue(entity) != null ? entity.GetType().GetProperty("vchitmPartID").GetValue(entity).ToString() : null,

                        //vchitmIMQty
                        OldVal3 = status != 'I' && entity.GetType().GetProperty("vchitmIMQty").GetValue(oldEntity) != null ? entity.GetType().GetProperty("vchitmIMQty").GetValue(oldEntity).ToString() : null,
                        NewVal3 = status != 'D' && entity.GetType().GetProperty("vchitmIMQty").GetValue(entity) != null ? entity.GetType().GetProperty("vchitmIMQty").GetValue(entity).ToString() : null,

                        //vchitmExQty
                        OldVal4 = status != 'I' && entity.GetType().GetProperty("vchitmExQty").GetValue(oldEntity) != null ? entity.GetType().GetProperty("vchitmExQty").GetValue(oldEntity).ToString() : null,
                        NewVal4 = status != 'D' && entity.GetType().GetProperty("vchitmExQty").GetValue(entity) != null ? entity.GetType().GetProperty("vchitmExQty").GetValue(entity).ToString() : null,

                        //vchitmUnitPrice
                        OldVal5 = status != 'I' && entity.GetType().GetProperty("vchitmUnitPrice").GetValue(oldEntity) != null ? entity.GetType().GetProperty("vchitmUnitPrice").GetValue(oldEntity).ToString() : null,
                        NewVal5 = status != 'D' && entity.GetType().GetProperty("vchitmUnitPrice").GetValue(entity) != null ? entity.GetType().GetProperty("vchitmUnitPrice").GetValue(entity).ToString() : null,

                        //vchitmPartInventoryLevel
                        OldVal6 = status != 'I' && entity.GetType().GetProperty("vchitmPartInventoryLevel").GetValue(oldEntity) != null ? entity.GetType().GetProperty("vchitmPartInventoryLevel").GetValue(oldEntity).ToString() : null,
                        NewVal6 = status != 'D' && entity.GetType().GetProperty("vchitmPartInventoryLevel").GetValue(entity) != null ? entity.GetType().GetProperty("vchitmPartInventoryLevel").GetValue(entity).ToString() : null,

                        //AllSUm
                        OldVal7 = status != 'I' && entity.GetType().GetProperty("AllSUm").GetValue(oldEntity) != null ? entity.GetType().GetProperty("AllSUm").GetValue(oldEntity).ToString() : null,
                        NewVal7 = status != 'D' && entity.GetType().GetProperty("AllSUm").GetValue(entity) != null ? entity.GetType().GetProperty("AllSUm").GetValue(entity).ToString() : null,

                        //vchhdrNo
                        OldVal8 = _header.vchhdrNo,
                        NewVal8 = _header.vchhdrNo,

                        //vchhdrIO
                        OldVal9 = _header.vchhdrIO,
                        NewVal9 = _header.vchhdrIO,

                        //InvoiceNumber
                        OldVal10 = _header.InvoiceNumber,
                        NewVal10 = _header.InvoiceNumber,


                        UserName = !string.IsNullOrEmpty(userId) ? (await db.PubUsers.Where(p => p.Id.ToString().Equals(userId)).FirstOrDefaultAsync()).UserName : null,
                        MedicalCenterId = medicalCenterId.Value,
                        Status = status.ToString(),
                    });
                    await db.SaveChangesAsync();
                }
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        #endregion




        public async Task Add_Android(T entity)
        {
            try
            {

                entity.GetType().GetProperty("Id").SetValue(entity, Guid.NewGuid());
                entity.GetType().GetProperty("ModifiedDate").SetValue(entity, DateTime.Now);
                FrameworkContext.Set<T>().Add(entity);

                await FrameworkContext.SaveChangesAsync();
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }

        public async Task AddIntWithOutModifiedDate(T entity)
        {
            try
            {
                FrameworkContext.Set<T>().Add(entity);
                await FrameworkContext.SaveChangesAsync();
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }

        public async Task AddRange(IEnumerable<T> list, string userId = null, Guid? medicalCenterId = null)
        {
            try
            {
                FrameworkContext.Set<T>().AddRange(list);
                await FrameworkContext.SaveChangesAsync();


                if (typeof(T).FullName == "Repository.Model.Customer_Insurance")
                {
                    foreach (var item in list)
                    {
                        await CustomerInsuranceEventLog(item, 'I', userId, medicalCenterId);
                    }
                }
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }

        public async Task AddNoSaveChange(T entity)
        {
            try
            {
                await Task.Run(() =>
                {
                    entity.GetType().GetProperty("ModifiedDate").SetValue(entity, DateTime.Now);
                    entity.GetType().GetProperty("Id").SetValue(entity, Guid.NewGuid());
                    FrameworkContext.Set<T>().Add(entity);
                });
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }

        public async Task AddNoSaveChangeInt(T entity)
        {
            try
            {
                entity.GetType().GetProperty("ModifiedDate").SetValue(entity, DateTime.Now);
                FrameworkContext.Set<T>().Add(entity);
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }

        public async Task Detached(T entity)
        {
            try
            {
                FrameworkContext.Entry(entity).State = System.Data.Entity.EntityState.Detached;
                FrameworkContext = await Task.FromResult(DbFactory.GetNewContext());
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task UpdateNoSaveChange(T entity)
        {
            try
            {
                entity.GetType().GetProperty("ModifiedDate").SetValue(entity, DateTime.Now);
                FrameworkContext.Entry(entity).State = System.Data.Entity.EntityState.Modified;
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task Delete(T entity)
        {
            try
            {
                entity.GetType().GetProperty("IsDeleted").SetValue(entity, true);
                await FrameworkContext.SaveChangesAsync();
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task DeleteNoSaveChange(T entity)
        {
            try
            {
                entity.GetType().GetProperty("IsDeleted").SetValue(entity, true);
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task Delete(Expression<Func<T, bool>> predicate, T oldEntity = default(T), string userId = null, Guid? medicalCenterId = null)
        {
            try
            {
                foreach (var item in await FrameworkContext.Set<T>().Where(predicate).ToListAsync())
                {
                    item.GetType().GetProperty("IsDeleted").SetValue(item, true);
                }
                await FrameworkContext.SaveChangesAsync();

                switch (typeof(T).FullName)
                {
                    case "Repository.Model.Customer_Insurance":
                        await CustomerInsuranceEventLog(oldEntity, 'D', userId, medicalCenterId, oldEntity);
                        break;
                }
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public void Dispose()
        {
            if (FrameworkContext != null)
            {
                //    FrameworkContext.Dispose();
            }
            GC.SuppressFinalize(this);
        }
        public async Task LogicalDeleteWithAttach(T entity)
        {
            try
            {
                FrameworkContext.Set<T>().Attach(entity);
                FrameworkContext.Set<T>().Remove(entity);
                await FrameworkContext.SaveChangesAsync();
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task ExecuteSqlCommand(string sqlStr)
        {
            try
            {
                await Task.FromResult(FrameworkContext.Database.ExecuteSqlCommand(sqlStr));
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }





        public async Task<string> RunQuery_Str(string sqlStr)
        {
            try
            {
                return (await Task.FromResult(FrameworkContext.Database.SqlQuery<string>(sqlStr))).SingleOrDefault();
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }
        public async Task<int> RunQuery_int(string sqlStr)
        {
            try
            {
                return (await Task.FromResult(FrameworkContext.Database.SqlQuery<int>(sqlStr))).SingleOrDefault();
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"", ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }
        }

        public async Task<int> CountAll_WithQuery(string tableName, string condition = "")
        {
            int res;
            if (string.IsNullOrEmpty(condition))
                res = (await RunQuery_int("SELECT COUNT(*) FROM " + tableName + ""));
            else
                res = (await RunQuery_int("SELECT COUNT(*) FROM " + tableName + " WHERE " + condition));
            return res;
        }

        public async Task Delete_Logical_WithQuery(string tableName, string id, string condition = "")
        {
            if (!string.IsNullOrEmpty(condition))
                await ExecuteSqlCommand("DELETE FROM " + tableName + " WHERE " + condition);
            else
                await ExecuteSqlCommand("DELETE FROM " + tableName + " WHERE Id = '" + id + "'");
        }
    }
}
