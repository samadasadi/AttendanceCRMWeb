using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Xml;

namespace Utility.HtmlHelpers
{
    public interface ITableColumn
    {
        ITableColumn Title(string title);
    }
    public interface ITableColumnInternal<TModel> where TModel : class
    {
        string ColumnTitle { get; set; }
        string Evaluate(TModel model);
    }
    public class TableColumn<TModel, TProperty> : ITableColumn, ITableColumnInternal<TModel> where TModel : class
    {
        /// <summary>
        /// Column title to display in the table.
        /// </summary>
        public string ColumnTitle { get; set; }

        /// <summary>
        /// Compiled lambda expression to get the property value from a model object.
        /// </summary>
        public Func<TModel, TProperty> CompiledExpression { get; set; }

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="expression">Lambda expression identifying a property to be rendered.</param>
        public TableColumn(Expression<Func<TModel, TProperty>> expression)
        {
            string propertyName = (expression.Body as MemberExpression).Member.Name;
            this.ColumnTitle = Regex.Replace(propertyName, "([a-z])([A-Z])", "$1 $2");
            this.CompiledExpression = expression.Compile();
        }

        /// <summary>
        /// Set the title for the column.
        /// </summary>
        /// <param name="title">Title for the column.</param>
        /// <returns>Instance of a TableColumn.</returns>
        public ITableColumn Title(string title)
        {
            this.ColumnTitle = title;
            return this;
        }

        /// <summary>
        /// Get the property value from a model object.
        /// </summary>
        /// <param name="model">Model to get the property value from.</param>
        /// <returns>Property value from the model.</returns>
        public string Evaluate(TModel model)
        {
            var result = this.CompiledExpression(model);
            return result == null ? string.Empty : result.ToString();
        }
    }
    public class TableBuilder<TModel> : ITableBuilder<TModel> where TModel : class
    {
        private HtmlHelper HtmlHelper { get; set; }
        private IEnumerable<TModel> Data { get; set; }

        /// <summary>
        /// Default constructor.
        /// </summary>
        private TableBuilder()
        {
        }

        /// <summary>
        /// Constructor.
        /// </summary>
        internal TableBuilder(HtmlHelper helper)
        {
            this.HtmlHelper = helper;

            this.TableColumns = new List<ITableColumnInternal<TModel>>();
        }

        /// <summary>
        /// Set the enumerable list of model objects.
        /// </summary>
        /// <param name="dataSource">Enumerable list of model objects.</param>
        /// <returns>Reference to the TableBuilder object.</returns>
        public TableBuilder<TModel> DataSource(IEnumerable<TModel> dataSource)
        {
            this.Data = dataSource;
            return this;
        }

        /// <summary>
        /// List of table columns to be rendered in the table.
        /// </summary>
        internal IList<ITableColumnInternal<TModel>> TableColumns { get; set; }

        /// <summary>
        /// Add an lambda expression as a TableColumn.
        /// </summary>
        /// <typeparam name="TProperty">Model class property to be added as a column.</typeparam>
        /// <param name="expression">Lambda expression identifying a property to be rendered.</param>
        /// <returns>An instance of TableColumn.</returns>
        internal ITableColumn AddColumn<TProperty>(Expression<Func<TModel, TProperty>> expression)
        {
            TableColumn<TModel, TProperty> column = new TableColumn<TModel, TProperty>(expression);
            this.TableColumns.Add(column);
            return column;
        }

        /// <summary>
        /// Create an instance of the ColumnBuilder to add columns to the table.
        /// </summary>
        /// <param name="columnBuilder">Delegate to create an instance of ColumnBuilder.</param>
        /// <returns>An instance of TableBuilder.</returns>
        public TableBuilder<TModel> Columns(Action<ColumnBuilder<TModel>> columnBuilder)
        {
            ColumnBuilder<TModel> builder = new ColumnBuilder<TModel>(this);
            columnBuilder(builder);
            return this;
        }

        /// <summary>
        /// Convert the TableBuilder to HTML.
        /// </summary>
        public MvcHtmlString ToHtml(string fnOperationRowOnclick = "", bool isShowButtonDeleteAndUpdate = true, string pathImage = "", string noImagePath = "", bool isDeleteAll = false, string idTextSearch = "", string[] lstIcons = null)
        {
            XmlDocument html = new XmlDocument();

            XmlElement table = html.CreateElement("table");
            html.AppendChild(table);
            table.SetAttribute("class", "table table-hover table-bordered text-nowrap");
            XmlElement thead = html.CreateElement("thead");
            table.AppendChild(thead);
            XmlElement tr = html.CreateElement("tr");
            //tr.SetAttribute("style", "background-color: #848484;color:white;");
            thead.AppendChild(tr);

            #region Add Operation Thead Before
            if (isShowButtonDeleteAndUpdate || (lstIcons != null && lstIcons.Count() > 0))
            {
                XmlElement tdOperationTheadAfter = html.CreateElement("th");
                tdOperationTheadAfter.SetAttribute("style", "vertical-align: middle;");
                tdOperationTheadAfter.InnerText = "عملیات";
                tr.AppendChild(tdOperationTheadAfter);
            }
            if (isDeleteAll)
            {
                XmlElement tdOperationTheadBefore = html.CreateElement("th");
                tdOperationTheadBefore.SetAttribute("style", "vertical-align: middle;");
                tdOperationTheadBefore.InnerXml = $@"<input type='checkbox' onclick='selectAll_{idTextSearch}(this);'/>";
                tr.AppendChild(tdOperationTheadBefore);
            }

            if (!string.IsNullOrEmpty(pathImage))
            {
                XmlElement tdOperationTheadBefore1 = html.CreateElement("th");
                tdOperationTheadBefore1.SetAttribute("style", "vertical-align: middle;");
                tdOperationTheadBefore1.InnerText = "تصویر";
                tr.AppendChild(tdOperationTheadBefore1);
            }
            #endregion

            foreach (ITableColumnInternal<TModel> tc in this.TableColumns)
            {
                if (!string.IsNullOrEmpty(tc.ColumnTitle))
                {
                    XmlElement td = html.CreateElement("th");
                    td.SetAttribute("style", "vertical-align: middle;");
                    td.InnerText = tc.ColumnTitle;
                    tr.AppendChild(td);
                }
            }

            #region Add Operation Thead After

            #endregion

            XmlElement tbody = html.CreateElement("tbody");
            table.AppendChild(tbody);

            int row = 0;
            foreach (TModel model in this.Data)
            {
                tr = html.CreateElement("tr");
                tbody.AppendChild(tr);

                #region Add Operation Tbody Before

                #region Operation Button
                XmlElement tdOperationTbodyAfter = html.CreateElement("td");
                if (isShowButtonDeleteAndUpdate)
                {
                    tdOperationTbodyAfter.InnerXml = $@"<a class='btn btn-danger btn-sm' href='#' onclick='deleteRow_{idTextSearch}(" + "\"" + model.GetType().GetProperty(Utility.Utitlies.VaribleForName.NameIdForOperation).GetValue(model) + "\"" + ");'><i class='fas fa-trash'></i></a>     <a class='btn btn-info btn-sm' href='#'  onclick='editRow_" + idTextSearch + "(" + "\"" + model.GetType().GetProperty(Utility.Utitlies.VaribleForName.NameIdForOperation).GetValue(model) + "\"" + ");'><i class='fas fa-pencil-alt'></i>&nbsp;&nbsp;ویرایش</a>";
                    //tdOperationTbodyAfter.InnerXml = $@"<i style='color: #dd4b39;margin-left: 5px;font-size: 15px !important;' onclick='deleteRow_{idTextSearch}(" + "\"" + model.GetType().GetProperty(Utility.Utitlies.VaribleForName.NameIdForOperation).GetValue(model) + "\"" + ");' class='fa fa-trash'></i><i style='color: #00c0ef;font-size: 15px !important;' onclick='editRow_" + idTextSearch + "(" + "\"" + model.GetType().GetProperty(Utility.Utitlies.VaribleForName.NameIdForOperation).GetValue(model) + "\"" + ");' class='fa fa-edit'></i>";
                }
                if (lstIcons != null && lstIcons.Count() > 0)
                {
                    foreach (string item in lstIcons)
                    {
                        tdOperationTbodyAfter.InnerXml += $@"{model.GetType().GetProperty(item).GetValue(model)}";
                    }
                }
                if (isShowButtonDeleteAndUpdate || (lstIcons != null && lstIcons.Count() > 0)) tr.AppendChild(tdOperationTbodyAfter);
                #endregion

                if (isDeleteAll)
                {
                    XmlElement tdOperationTbodyBefore = html.CreateElement("td");
                    tdOperationTbodyBefore.InnerXml = $@"<input type='checkbox' name='chk_{idTextSearch}' class='checkBox' value='{model.GetType().GetProperty(Utitlies.VaribleForName.NameIdForOperation).GetValue(model)}' />";
                    tr.AppendChild(tdOperationTbodyBefore);
                }

                if (!string.IsNullOrEmpty(pathImage))
                {
                    string strImage = model.GetType().GetProperty(Utility.Utitlies.VaribleForName.NameImageForShowImage).GetValue(model) != null ? pathImage + model.GetType().GetProperty(Utility.Utitlies.VaribleForName.NameImageForShowImage).GetValue(model) : noImagePath;
                    XmlElement tdImage = html.CreateElement("td");
                    tdImage.InnerXml = $@"<a href='{strImage}' target='_blank'><img class='img-circle' src='{strImage}' style='width: 74px;height: 74px;box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.5);'/></a>";
                    tr.AppendChild(tdImage);
                }
                #endregion

                foreach (ITableColumnInternal<TModel> tc in this.TableColumns)
                {
                    if (!string.IsNullOrEmpty(tc.ColumnTitle))
                    {
                        XmlElement td = html.CreateElement("td");
                        td.SetAttribute("onclick", string.Format(fnOperationRowOnclick, model.GetType().GetProperty(Utility.Utitlies.VaribleForName.NameIdForOperation).GetValue(model)));
                        td.InnerText = tc.Evaluate(model);
                        tr.AppendChild(td);
                    }
                }

                #region Add Operation Tbody After

                #endregion

                row++;

            }

            return new MvcHtmlString(html.OuterXml);
        }
    }
    public class ColumnBuilder<TModel> where TModel : class
    {
        public TableBuilder<TModel> TableBuilder { get; set; }

        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="tableBuilder">Instance of a TableBuilder.</param>
        public ColumnBuilder(TableBuilder<TModel> tableBuilder)
        {
            TableBuilder = tableBuilder;
        }

        /// <summary>
        /// Add lambda expressions to the TableBuilder.
        /// </summary>
        /// <typeparam name="TProperty">Class property that is rendered in the column.</typeparam>
        /// <param name="expression">Lambda expression identifying a property to be rendered.</param>
        /// <returns>An instance of TableColumn.</returns>
        public ITableColumn Expression<TProperty>(Expression<Func<TModel, TProperty>> expression)
        {
            return TableBuilder.AddColumn(expression);
        }
    }
    public interface ITableBuilder<TModel> where TModel : class
    {
        TableBuilder<TModel> DataSource(IEnumerable<TModel> dataSource);
        TableBuilder<TModel> Columns(Action<ColumnBuilder<TModel>> columnBuilder);
    }
    public static class MvcHtmlTableExtensions
    {
        /// <summary>
        /// Return an instance of a TableBuilder.
        /// </summary>
        /// <typeparam name="TModel">Type of model to render in the table.</typeparam>
        /// <returns>Instance of a TableBuilder.</returns>
        public static ITableBuilder<TModel> TableFor<TModel>(this HtmlHelper helper) where TModel : class
        {
            return new TableBuilder<TModel>(helper);
        }

        ///////////////////////////////////////////////////////////////////////////////////////////////////////
    }
}
