import unittest

from backend.file_utils import build_stored_name


class BuildStoredNameTests(unittest.TestCase):
    def test_preserves_extension_and_uses_random_suffix(self):
        stored_name = build_stored_name("report.pdf")
        self.assertTrue(stored_name.endswith(".pdf"))
        self.assertNotEqual(stored_name, "report.pdf")

    def test_preserves_compound_extension(self):
        stored_name = build_stored_name("archive.tar.gz")
        self.assertTrue(stored_name.endswith(".tar.gz"))

    def test_handles_hidden_dotfile_name(self):
        stored_name = build_stored_name(".env")
        self.assertTrue(stored_name.endswith(".env"))

    def test_uses_safe_fallback_for_empty_filename(self):
        stored_name = build_stored_name("")
        self.assertTrue(stored_name.startswith("upload-"))
        self.assertTrue(stored_name.endswith(".bin"))


if __name__ == "__main__":
    unittest.main()
