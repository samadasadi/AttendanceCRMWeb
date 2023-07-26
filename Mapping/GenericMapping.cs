using AutoMapper;
using AutoMapper.Configuration;
using System.Reflection;

namespace Mapping
{
    public class GenericMapping<TSource, TDestination> : Profile
    {
        public static IMappingExpression<TSource, TDestination> CreateMapping()
        {
            var _res = new MapperConfigurationExpression();
            return _res.CreateMap<TSource, TDestination>();

            //var _profile = new IProfileExpression();
            //return _profile.CreateMap<TSource, TDestination>();

            // return Mapper.CreateMap<TSource, TDestination>();
        }



        // vahid panahi commented this block
        /* public static void CreateMappingSingle()
         {
             Mapper.CreateMap<TSource, TDestination>();
         }*/

        /// <summary>
        /// Only Map
        /// </summary>
        /// <param name="source"></param>
        /// <returns></returns>
        public static TDestination Map(TSource source)
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<TSource, TDestination>();
            });

            IMapper mapper = config.CreateMapper();
            var dest = mapper.Map<TSource, TDestination>(source);
            return dest;


            //var res = Mapper.Map<TSource, TDestination>(source);
            //return res;
        }
        /// <summary>
        /// Map Whit CreateMap
        /// </summary>
        /// <param name="source"></param>
        /// <returns></returns>
        public static TDestination MapToDestination(TSource source)
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<TSource, TDestination>();
            });

            IMapper mapper = config.CreateMapper();
            var dest = mapper.Map<TSource, TDestination>(source);
            return dest;



            //Mapper.CreateMap<TSource, TDestination>();
            //var res = Mapper.Map<TSource, TDestination>(source);
            //return res;
        }
    }
}