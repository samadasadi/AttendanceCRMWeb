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

        public async Task Commit(T entity = default(T), T oldEntity = default(T), string userId = null)
        {
            try
            {
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

                return (FrameworkContext.Database.SqlQuery<TClass>(sqlStr).AsQueryable());
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


        #region

        public async Task Add(T entity, string userId = null)
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

        public async Task<T> AddIntWithReturn(T entity, string userId = null)
        {
            try
            {

                entity.GetType().GetProperty("ModifiedDate").SetValue(entity, DateTime.Now);
                T res = FrameworkContext.Set<T>().Add(entity);
                await FrameworkContext.SaveChangesAsync();

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

        public async Task Update(T entity, T oldEntity = default(T), string userId = null)
        {
            try
            {
                entity.GetType().GetProperty("ModifiedDate").SetValue(entity, DateTime.Now);
                FrameworkContext.Set<T>().Attach(entity);
                FrameworkContext.Entry(entity).State = System.Data.Entity.EntityState.Modified;

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

        public async Task LogicalDelete(T entity, T oldEntity = default(T), string userId = null)
        {
            try
            {
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

        public async Task LogicalDelete(Expression<Func<T, bool>> predicate, T oldEntity = default(T), string userId = null)
        {
            try
            {
                foreach (var item in (await FrameworkContext.Set<T>().Where(predicate).ToListAsync()))
                {
                    FrameworkContext.Set<T>().Remove(item);

                }
                await FrameworkContext.SaveChangesAsync();
            }
            catch (DbEntityValidationException e)
            {
                throw;
            }
        }

        public async Task AddMultiSaveChange(T entity, string userId = null)
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

        public async Task AddInt(T entity, string userId = null)
        {
            try
            {//Repository.Model.WarehouseItem
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

        public async Task AddRange(IEnumerable<T> list, string userId = null)
        {
            try
            {
                FrameworkContext.Set<T>().AddRange(list);
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

        public async Task Delete(Expression<Func<T, bool>> predicate, T oldEntity = default(T), string userId = null)
        {
            try
            {
                foreach (var item in await FrameworkContext.Set<T>().Where(predicate).ToListAsync())
                {
                    item.GetType().GetProperty("IsDeleted").SetValue(item, true);
                }
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
