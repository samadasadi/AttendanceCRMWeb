using System;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Repository.iContext;
using Repository.Model;
using Task = System.Threading.Tasks.Task;

namespace Repository
{
    public interface ICodingRepository : IRepository<Coding> { }
    public class CodingRepository : ICodingRepository
    {
        public IContextFactory DbFactory { get; set; }
        public FrameworkContext FrameworkContext { get; set; }




        public async Task Add(Coding entity, string userId = null, Guid? medicalCenterId = null)
        {
            FrameworkContext.Set<Coding>().Add(entity);
            await FrameworkContext.SaveChangesAsync();
        }

        public Task AddInt(Coding entity, string userId = null, Guid? medicalCenterId = null)
        {
            throw new NotImplementedException();
        }

        public Task AddIntWithOutModifiedDate(Coding entity)
        {
            throw new NotImplementedException();
        }

        public Task<Coding> AddIntWithReturn(Coding entity, string userId = null, Guid? medicalCenterId = null)
        {
            throw new NotImplementedException();
        }

        public Task AddMultiSaveChange(Coding entity, string userId = null, Guid? medicalCenterId = null)
        {
            throw new NotImplementedException();
        }

        public Task AddNoSaveChange(Coding entity)
        {
            throw new NotImplementedException();
        }

        public Task AddNoSaveChangeInt(Coding entity)
        {
            throw new NotImplementedException();
        }

        public Task AddRange(IEnumerable<Coding> list, string userId = null, Guid? medicalCenterId = null)
        {
            throw new NotImplementedException();
        }

        public Task<Coding> AddWithReturn(Coding entity)
        {
            throw new NotImplementedException();
        }

        public Task Add_Android(Coding entity)
        {
            throw new NotImplementedException();
        }

        public async Task Commit(Coding entity = null, Coding oldEntity = null, string userId = null, Guid? medicalCenterId = null)
        {
          await  FrameworkContext.SaveChangesAsync();
        }

        public Task<int> CountAll()
        {
            throw new NotImplementedException();
        }

        public Task<int> CountAll_WithQuery(string tableName, string condition = "")
        {
            throw new NotImplementedException();
        }

        public Task<bool> CustomAny(Expression<Func<Coding, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public async Task Delete(Coding entity)
        {
            FrameworkContext.Set<Coding>().Remove(entity);
          await  FrameworkContext.SaveChangesAsync();
        }
        public async Task Delete(Expression<Func<Coding, bool>> predicate, Coding oldEntity = null, string userId = null, Guid? medicalCenterId = null)
        {
            foreach (var item in FrameworkContext.Set<Coding>().Where(predicate).ToList())
            {
                FrameworkContext.Set<Coding>().Remove(item);
               await FrameworkContext.SaveChangesAsync();
            }
          await  Commit();
        }
        public async Task DeleteNoSaveChange(Coding entity)
        {
            await Task.FromResult(FrameworkContext.Set<Coding>().Remove(entity));
        }

        public Task Delete_Logical_WithQuery(string tableName, string id, string condition = "")
        {
            throw new NotImplementedException();
        }

        public async Task Detached(Coding entity)
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

        public void Dispose()
        {
            GC.SuppressFinalize(this);
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

        public async Task<Coding> Find(object key)
        {
            return await Task.FromResult(FrameworkContext.Set<Coding>().Find(key));
        }
        public async Task<Coding> First(Expression<Func<Coding, bool>> predicate)
        {
            return await Task.FromResult(FrameworkContext.Set<Coding>().FirstOrDefault(predicate));
        }

        public Task<string> GenerateDeleteSqlStr(string tableName, string condition)
        {
            throw new NotImplementedException();
        }

        public async Task<IQueryable<Coding>> Get(Expression<Func<Coding, bool>> predicate)
        {
            return await Task.FromResult(FrameworkContext.Set<Coding>().Where(predicate));
        }
        public async Task<IQueryable<Coding>> GetAll()
        {
            return await Task.FromResult(FrameworkContext.Set<Coding>());
        }

        public Task<IQueryable<Coding>> GetAllOrderBy(Func<Coding, object> keySelector)
        {
            throw new NotImplementedException();
        }

        public Task<IQueryable<Coding>> GetAllOrderByDescending(Func<Coding, object> keySelector)
        {
            throw new NotImplementedException();
        }

        public Task<IQueryable<Coding>> GetAsNoTracking(Expression<Func<Coding, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public Task LogicalDelete(Coding entity, Coding oldEntity = null, string userId = null, Guid? medicalCenterId = null)
        {
            throw new NotImplementedException();
        }

        public Task LogicalDelete(Expression<Func<Coding, bool>> predicate, Coding oldEntity = null, string userId = null, Guid? medicalCenterId = null)
        {
            throw new NotImplementedException();
        }

        public Task LogicalDeleteWithAttach(Coding entity)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<dynamic>> RunQuery(string sqlStr)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<TClass>> RunQuery<TClass>(string spName, object[] parameters) where TClass : class, new()
        {
            throw new NotImplementedException();
        }

        public Task<IQueryable<TClass>> RunQuery<TClass>(string sqlStr) where TClass : class, new()
        {
            throw new NotImplementedException();
        }

        public Task<int> RunQuery_int(string sqlStr)
        {
            throw new NotImplementedException();
        }

        public Task<string> RunQuery_Str(string sqlStr)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Coding>> RunTQuery(string sqlStr)
        {
            throw new NotImplementedException();
        }

        public Task<int> TCount(Expression<Func<Coding, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public Task Update(Coding entity, Coding oldEntity = null, string userId = null, Guid? medicalCenterId = null)
        {
            throw new NotImplementedException();
        }

        public Task UpdateNoSaveChange(Coding entity)
        {
            throw new NotImplementedException();
        }
    }
}
