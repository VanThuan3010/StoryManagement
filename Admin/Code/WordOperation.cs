using Word = Microsoft.Office.Interop.Word;

namespace Admin.Code
{
    public class TxtToWord{
        static void AddHeading(Word.Document doc, string text, Word.WdBuiltinStyle style)
        {
            Word.Paragraph para = doc.Content.Paragraphs.Add();
            para.Range.Text = text;
            para.Range.set_Style(style);
            para.Range.InsertParagraphAfter();
        }
        static void AddParagraph(Word.Document doc, string text)
        {
            Word.Paragraph para = doc.Content.Paragraphs.Add();
            para.Range.Text = text;
            para.Range.set_Style(Word.WdBuiltinStyle.wdStyleNormal);
            para.Range.InsertParagraphAfter();
        }
        private static void WriteWord()
        {
            Word.Application wordApp = null;
            Word.Document doc = null;

            try
            {
                // Khởi tạo ứng dụng Word
                wordApp = new Word.Application();
                wordApp.Visible = false;

                // Tạo tài liệu mới
                doc = wordApp.Documents.Add();
                string[] lines = File.ReadAllLines(@"D:\Code\CSharp\120.txt");
                string pattern = @"^chương\s\d+";
                List<Template> lst = new List<Template>();

                foreach (string line in lines)
                {
                    if (Regex.IsMatch(line.Trim().ToLower(), pattern))
                    {
                        AddHeading(doc, line.Trim(), Word.WdBuiltinStyle.wdStyleHeading1);
                        Console.WriteLine(line.Trim());
                    }
                    else
                    {
                        AddParagraph(doc, line);
                    }
                }
                object filename = @"D:\Code\CSharp\ExampleWithHeadings.docx";
                doc.SaveAs2(ref filename);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Đã xảy ra lỗi: " + ex.Message);
            }
            finally
            {
                // Đóng tài liệu nếu nó đã được tạo
                if (doc != null)
                {
                    doc.Close();
                    System.Runtime.InteropServices.Marshal.ReleaseComObject(doc);
                }

                // Thoát ứng dụng Word nếu nó đã được khởi tạo
                if (wordApp != null)
                {
                    wordApp.Quit();
                    System.Runtime.InteropServices.Marshal.ReleaseComObject(wordApp);
                }

                doc = null;
                wordApp = null;

                // Thu hồi bộ thu gom rác
                GC.Collect();
                GC.WaitForPendingFinalizers();
            }
        }
        private static void WriteWord2()
        {
            Word.Application wordApp = null;
            Word.Document doc = null;

            try
            {
                // Khởi tạo ứng dụng Word
                wordApp = new Word.Application();
                wordApp.Visible = false;

                // Tạo tài liệu mới
                doc = wordApp.Documents.Add();
                string pattern = @"^chương\s\d+";
                List<Template> lst = new List<Template>();
                string chapterTitle = "O";
                StringBuilder chapterContent = new StringBuilder();

                // Đọc tệp theo từng dòng
                foreach (string line in File.ReadLines(@"D:\Code\CSharp\120.txt"))
                {
                    if (Regex.IsMatch(line.Trim().ToLower(), pattern))
                    {
                        Console.WriteLine(line);
                        if (chapterContent.Length > 0)  // Nếu có nội dung của chapter trước
                        {
                            lst.Add(new Template()
                            {
                                Name = chapterTitle,
                                Chapters = chapterContent.ToString()
                            });
                            chapterContent.Clear();  // Xóa nội dung chapter cũ
                        }
                        chapterTitle = line.Trim();  // Cập nhật tên chapter mới
                    }
                    else
                    {
                        chapterContent.AppendLine(line);  // Thêm dòng vào nội dung chapter
                    }
                }

                // Nếu có nội dung chapter còn lại sau cùng
                if (chapterContent.Length > 0)
                {
                    lst.Add(new Template()
                    {
                        Name = chapterTitle,
                        Chapters = chapterContent.ToString()
                    });
                }

                // Ghi vào tài liệu Word
                foreach (Template template in lst)
                {
                    AddHeading(doc, template.Name, Word.WdBuiltinStyle.wdStyleHeading1);
                    AddParagraph(doc, template.Chapters);
                }

                object filename = @"D:\Code\CSharp\ExampleWithHeadings.docx";
                doc.SaveAs2(ref filename);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Đã xảy ra lỗi: " + ex.Message);
            }
            finally
            {
                // Đóng tài liệu nếu nó đã được tạo
                if (doc != null)
                {
                    doc.Close();
                    System.Runtime.InteropServices.Marshal.ReleaseComObject(doc);
                }

                // Thoát ứng dụng Word nếu nó đã được khởi tạo
                if (wordApp != null)
                {
                    wordApp.Quit();
                    System.Runtime.InteropServices.Marshal.ReleaseComObject(wordApp);
                }

                doc = null;
                wordApp = null;

                // Thu hồi bộ thu gom rác
                GC.Collect();
                GC.WaitForPendingFinalizers();
            }
        }
        static void DeleteAllFilesInDirectory(string directoryPath)
        {
            foreach (string file in Directory.GetFiles(directoryPath))
            {
                File.Delete(file);
            }

            foreach (string subDirectory in Directory.GetDirectories(directoryPath))
            {
                DeleteAllFilesInDirectory(subDirectory);
            }
        }
    }
}