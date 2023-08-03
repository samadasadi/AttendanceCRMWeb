using Repository;
using Repository.iContext;
using Repository.Model;
using Repository.Model.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.Common
{
    public partial interface IGenericAttributeService
    {
        /// <summary>
        /// Deletes an attribute
        /// </summary>
        /// <param name="attribute">Attribute</param>
        System.Threading.Tasks.Task DeleteAttribute(GenericAttribute attribute);

        /// <summary>
        /// Gets an attribute
        /// </summary>
        /// <param name="attributeId">Attribute identifier</param>
        /// <returns>An attribute</returns>
        Task<GenericAttribute> GetAttributeById(Guid attributeId);

        /// <summary>
        /// Inserts an attribute
        /// </summary>
        /// <param name="attribute">attribute</param>
        System.Threading.Tasks.Task InsertAttribute(GenericAttribute attribute);

        /// <summary>
        /// Updates the attribute
        /// </summary>
        /// <param name="attribute">Attribute</param>
        System.Threading.Tasks.Task UpdateAttribute(GenericAttribute attribute);

        /// <summary>
        /// Get attributes
        /// </summary>
        /// <param name="entityId">Entity identifier</param>
        /// <param name="keyGroup">Key group</param>
        /// <returns>Get attributes</returns>
        Task<IList<GenericAttribute>> GetAttributesForEntity(Guid entityId, string keyGroup);

        /// <summary>
        /// Save attribute value
        /// </summary>
        /// <typeparam name="TPropType">Property type</typeparam>
        /// <param name="entity">Entity</param>
        /// <param name="key">Key</param>
        /// <param name="value">Value</param>
        /// <param name="storeId">Store identifier; pass 0 if this attribute will be available for all stores</param>
        System.Threading.Tasks.Task SaveAttribute<TPropType>(BaseClass entity, string key, TPropType value);

        /// <summary>
        /// Get an attribute of an entity
        /// </summary>
        /// <typeparam name="TPropType">Property type</typeparam>
        /// <param name="entity">Entity</param>
        /// <param name="key">Key</param>
        /// <param name="storeId">Load a value specific for a certain store; pass 0 to load a value shared for all stores</param>
        /// <param name="defaultValue">Default value</param>
        /// <returns>Attribute</returns>
        Task<TPropType> GetAttribute<TPropType>(BaseClass entity, string key, TPropType defaultValue = default);

        /// <summary>
        /// Get an attribute of an entity
        /// </summary>
        /// <typeparam name="TPropType">Property type</typeparam>
        /// <param name="entityId">Entity identifier</param>
        /// <param name="key">Key</param>
        /// <param name="storeId">Load a value specific for a certain store; pass 0 to load a value shared for all stores</param>
        /// <param name="defaultValue">Default value</param>
        /// <returns>Attribute</returns>
        Task<TPropType> GetAttribute<TEntity, TPropType>(Guid entityId, string key, TPropType defaultValue = default)
            where TEntity : BaseClass;
    }
    public partial class GenericAttributeService : IGenericAttributeService
    {
        #region Fields

        private readonly IRepository<GenericAttribute> _genericAttributeRepository;

        #endregion

        #region Ctor

        public GenericAttributeService(
            IContextFactory contextFactory,
            IRepository<GenericAttribute> genericAttributeRepository)
        {
            var currentcontext = contextFactory.GetContext();
            _genericAttributeRepository = genericAttributeRepository;
            _genericAttributeRepository.FrameworkContext = currentcontext;
            _genericAttributeRepository.DbFactory = contextFactory;
        }

        #endregion

        #region Methods

        /// <summary>
        /// Deletes an attribute
        /// </summary>
        /// <param name="attribute">Attribute</param>
        public async System.Threading.Tasks.Task DeleteAttribute(GenericAttribute attribute)
        {
            if (attribute == null)
                throw new ArgumentNullException(nameof(attribute));

            var _query = $"delete from GenericAttribute where [Key] = N'{attribute.Key}'";
            await _genericAttributeRepository.ExecuteSqlCommand(_query);
            //await _genericAttributeRepository.LogicalDelete(attribute);
        }

        /// <summary>
        /// Gets an attribute
        /// </summary>
        /// <param name="attributeId">Attribute identifier</param>
        /// <returns>An attribute</returns>
        public async Task<GenericAttribute> GetAttributeById(Guid attributeId)
        {
            if (attributeId == Guid.Empty)
                return null;

            return (await _genericAttributeRepository.Get(x => x.Id == attributeId)).FirstOrDefault();
        }

        /// <summary>
        /// Inserts an attribute
        /// </summary>
        /// <param name="attribute">attribute</param>
        public async System.Threading.Tasks.Task InsertAttribute(GenericAttribute attribute)
        {
            if (attribute == null)
                throw new ArgumentNullException(nameof(attribute));

            attribute.CreatedOrUpdatedDateUTC = DateTime.UtcNow;
            attribute.ModifiedDate = DateTime.UtcNow;

            attribute.Id = Guid.NewGuid();
            await _genericAttributeRepository.Add(attribute);
        }

        /// <summary>
        /// Updates the attribute
        /// </summary>
        /// <param name="attribute">Attribute</param>
        public async System.Threading.Tasks.Task UpdateAttribute(GenericAttribute attribute)
        {
            if (attribute == null)
                throw new ArgumentNullException(nameof(attribute));

            attribute.CreatedOrUpdatedDateUTC = DateTime.UtcNow;
            await _genericAttributeRepository.Update(attribute);
        }

        /// <summary>
        /// Get attributes
        /// </summary>
        /// <param name="entityId">Entity identifier</param>
        /// <param name="keyGroup">Key group</param>
        /// <returns>Get attributes</returns>
        public async Task<IList<GenericAttribute>> GetAttributesForEntity(Guid entityId, string keyGroup)
        {
            try
            {
                var query = await _genericAttributeRepository.Get(x => x.EntityId == entityId && x.KeyGroup == keyGroup);

                var attributes = query.ToList();

                return attributes;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Save attribute value
        /// </summary>
        /// <typeparam name="TPropType">Property type</typeparam>
        /// <param name="entity">Entity</param>
        /// <param name="key">Key</param>
        /// <param name="value">Value</param>
        /// <param name="storeId">Store identifier; pass 0 if this attribute will be available for all stores</param>
        public async System.Threading.Tasks.Task SaveAttribute<TPropType>(BaseClass entity, string key, TPropType value)
        {
            try
            {
                if (entity == null)
                    throw new ArgumentNullException(nameof(entity));

                if (key == null)
                    throw new ArgumentNullException(nameof(key));

                var keyGroup = entity.GetType().Name;

                var props = (await GetAttributesForEntity(entity.Id, keyGroup)).ToList();
                var prop = props.FirstOrDefault(ga => ga.Key.Equals(key, StringComparison.InvariantCultureIgnoreCase));

                var valueStr = CommonHelper.To<string>(value);

                if (prop != null)
                {
                    if (string.IsNullOrWhiteSpace(valueStr))
                    {
                        //delete
                        await DeleteAttribute(prop);
                    }
                    else
                    {
                        //update
                        prop.Value = valueStr;
                        await UpdateAttribute(prop);
                    }
                }
                else
                {
                    if (string.IsNullOrWhiteSpace(valueStr))
                        return;

                    //insert
                    prop = new GenericAttribute
                    {
                        EntityId = entity.Id,
                        Key = key,
                        KeyGroup = keyGroup,
                        Value = valueStr,

                    };

                    await InsertAttribute(prop);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Get an attribute of an entity
        /// </summary>
        /// <typeparam name="TPropType">Property type</typeparam>
        /// <param name="entity">Entity</param>
        /// <param name="key">Key</param>
        /// <param name="storeId">Load a value specific for a certain store; pass 0 to load a value shared for all stores</param>
        /// <param name="defaultValue">Default value</param>
        /// <returns>Attribute</returns>
        public async Task<TPropType> GetAttribute<TPropType>(BaseClass entity, string key, TPropType defaultValue = default)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            var keyGroup = entity.GetType().Name;

            var props = await GetAttributesForEntity(entity.Id, keyGroup);

            if (props == null)
                return defaultValue;

            if (!props.Any())
                return defaultValue;

            var prop = props.FirstOrDefault(ga => ga.Key.Equals(key, StringComparison.InvariantCultureIgnoreCase));

            if (prop == null || string.IsNullOrEmpty(prop.Value))
                return defaultValue;

            return CommonHelper.To<TPropType>(prop.Value);
        }

        /// <summary>
        /// Get an attribute of an entity
        /// </summary>
        /// <typeparam name="TPropType">Property type</typeparam>
        /// <typeparam name="TEntity">Entity type</typeparam>
        /// <param name="entityId">Entity identifier</param>
        /// <param name="key">Key</param>
        /// <param name="storeId">Load a value specific for a certain store; pass 0 to load a value shared for all stores</param>
        /// <param name="defaultValue">Default value</param>
        /// <returns>Attribute</returns>
        public async Task<TPropType> GetAttribute<TEntity, TPropType>(Guid entityId, string key, TPropType defaultValue = default)
            where TEntity : BaseClass
        {
            var entity = (TEntity)Activator.CreateInstance(typeof(TEntity));
            entity.Id = entityId;

            return await GetAttribute(entity, key, defaultValue);
        }

        #endregion
    }
}
