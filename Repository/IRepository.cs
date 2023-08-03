using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using Repository.iContext;
using System.Linq;
using System.Threading.Tasks;
using Repository.Model;
using Task = System.Threading.Tasks.Task;

namespace Repository
{
    /// <summary>
    /// Defines interface for common data access functionality for entity.
    /// </summary>
    /// <typeparam name="T">T of entity.</typeparam>
    public interface IRepository<T>
    {
        FrameworkContext FrameworkContext { get; set; }
        IContextFactory DbFactory { get; set; }



        Task<IQueryable<T>> Get(Expression<Func<T, bool>> predicate);
        Task<int> TCount(Expression<Func<T, bool>> predicate);
        Task<T> First(Expression<Func<T, bool>> predicate);
        Task<T> Find(object key);
        Task<bool> CustomAny(Expression<Func<T, bool>> predicate);
        Task<IQueryable<T>> GetAll();
        Task<int> CountAll();
        Task<IQueryable<T>> GetAsNoTracking(Expression<Func<T, bool>> predicate);
        Task<IQueryable<T>> GetAllOrderBy(Func<T, object> keySelector);
        Task<IQueryable<T>> GetAllOrderByDescending(Func<T, object> keySelector);
        Task<IEnumerable<dynamic>> RunQuery(string sqlStr);
        Task<IEnumerable<T>> RunTQuery(string sqlStr);
        Task<IEnumerable<TClass>> RunQuery<TClass>(string spName, object[] parameters) where TClass : class, new();
        Task<IQueryable<TClass>> RunQuery<TClass>(string sqlStr) where TClass : class, new();



        Task<T> AddWithReturn(T entity);
        Task<T> AddIntWithReturn(T entity, string userId = null);
        Task<string> GenerateDeleteSqlStr(string tableName, string condition);


        Task Add(T entity, string userId = null);
        Task Add_Android(T entity);
        Task AddNoSaveChange(T entity);
        Task AddNoSaveChangeInt(T entity);
        Task AddMultiSaveChange(T entity, string userId = null);
        Task Update(T entity, T oldEntity = default(T), string userId = null);
        Task Detached(T entity);
        Task UpdateNoSaveChange(T entity);
        Task Delete(T entity);
        Task Delete(Expression<Func<T, bool>> predicate, T oldEntity = default(T), string userId = null);
        Task DeleteNoSaveChange(T entity);
        Task LogicalDelete(T entity, T oldEntity = default(T), string userId = null);
        Task LogicalDelete(Expression<Func<T, bool>> predicate, T oldEntity = default(T), string userId = null);
        Task LogicalDeleteWithAttach(T entity);
        Task Commit(T entity = default(T), T oldEntity = default(T), string userId = null);
        Task ExecuteSqlCommand(string sqlStr);
        Task AddRange(IEnumerable<T> list, string userId = null);
        Task AddInt(T entity, string userId = null);
        Task AddIntWithOutModifiedDate(T entity);


        Task<string> RunQuery_Str(string sqlStr);
        Task<int> RunQuery_int(string sqlStr);
        void Dispose();

        Task<int> CountAll_WithQuery(string tableName, string condition = "");

        Task Delete_Logical_WithQuery(string tableName, string id, string condition = "");

    }

}
