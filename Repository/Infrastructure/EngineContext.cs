using Ninject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Infrastructure
{
    public static class EngineContext
    {
        #region Methods

        [MethodImpl(MethodImplOptions.Synchronized)]
        public static IKernel Create()
        {
            return Singleton<IKernel>.Instance ?? (Singleton<IKernel>.Instance = new StandardKernel());
        }

        public static void Replace(IKernel engine)
        {
            Singleton<IKernel>.Instance = engine;
        }

        #endregion

        #region Properties

        public static IKernel Current
        {
            get
            {
                if (Singleton<IKernel>.Instance == null)
                {
                    Create();
                }

                return Singleton<IKernel>.Instance;
            }
        }
        public static T Resolve<T>()
        {
            return Current.Get<T>();
        }

        public static object Resolve(Type type)
        {
            return Current.Get(type);
        }
        public static object ResolveUnregistered(Type type)
        {
            Exception innerException = null;
            foreach (var constructor in type.GetConstructors())
            {
                try
                {
                    //try to resolve constructor parameters
                    var parameters = constructor.GetParameters().Select(parameter =>
                    {
                        var service = Resolve(parameter.ParameterType);
                        if (service == null)
                            throw new NopException("Unknown dependency");
                        return service;
                    });

                    //all is ok, so create instance
                    return Activator.CreateInstance(type, parameters.ToArray());
                }
                catch (Exception ex)
                {
                    innerException = ex;
                }
            }

            throw new NopException("No constructor was found that had all the dependencies satisfied.", innerException);
        }
        #endregion
    }
}
